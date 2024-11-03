import { clientStatuses, NetworkHint, NetworkPlayer, NetworkSlot, slotTypes } from "../api";
import { Client, UnknownSlotData } from "../client.ts";
import { EventBasedManager } from "./abstract.ts";
import { Hint } from "./items.ts";

/** A type alias for any known client status. See {@link clientStatuses} for more information. */
export type ClientStatus = typeof clientStatuses[keyof typeof clientStatuses];

/**
 * Manages tracking and updating all players in the room session.
 */
export class PlayersManager extends EventBasedManager<PlayerEvents> {
    readonly #client: Client;
    #players: NetworkPlayer[][] = [];
    #slots: Readonly<Record<string, NetworkSlot>> = {};
    #slot: number = 0;
    #team: number = 0;

    /**
     * Instantiates a new PlayersManager.
     * @internal
     * @param client The Archipelago client associated with this manager.
     */
    public constructor(client: Client) {
        super();
        this.#client = client;

        this.#client.socket
            .on("connected", (packet) => {
                this.#slots = Object.freeze(packet.slot_info);
                this.#players = [];
                this.#slot = packet.slot;
                this.#team = packet.team;

                // Populate players.
                for (const player of packet.players) {
                    this.#players[player.team] ??= [{ team: player.team, slot: 0, name: "Archipelago", alias: "Archipelago" }];
                    this.#players[player.team][player.slot] = player;
                }
            })
            .on("roomUpdate", (packet) => {
                // Ignore any updates that don't include player updates.
                if (!packet.players) {
                    return;
                }

                for (const player of packet.players) {
                    if (this.#players[player.team][player.slot].alias !== player.alias) {
                        const oldAlias = this.#players[player.team][player.slot].alias;
                        this.#players[player.team][player.slot] = player;
                        this.emit("aliasUpdated", [new Player(this.#client, player), oldAlias, player.alias]);
                    }
                }
            });
    }

    /** Returns the {@link Player} for this client's player. */
    public get self(): Player {
        if (this.#slot === 0) {
            throw new Error("Cannot lookup own player object when client has never connected to a server.");
        }

        return new Player(this.#client, this.#players[this.#team][this.#slot]);
    }

    /**
     * Returns a record of basic information for each slot.
     * @remarks Slot information is shared across each team. For accessing player data, see {@link PlayersManager}.
     */
    public get slots(): Readonly<Record<number, NetworkSlot>> {
        return this.#slots;
    }

    /**
     * Returns a 2D array of player metadata ranked by team number, then slot number.
     * @example <caption>Print All Player Aliases to Console</caption>
     * for (const team of client.players.teams) {
     *     for (const player of team) {
     *         console.log(player.alias);
     *     }
     * }
     */
    public get teams(): Player[][] {
        const players: Player[][] = [];
        for (let team = 0; team < this.#players.length; team++) {
            players[team] = [];
            for (let player = 0; player < this.#players[team].length; player++) {
                players[team].push(new Player(this.#client, this.#players[team][player]));
            }
        }

        return players;
    }

    /**
     * Attempt to find a player by their team or slot name.
     * @param team The team id associated with the searched player.
     * @param slot The slot id associated with the searched player.
     * @returns The player's metadata or `undefined` if not found.
     */
    public findPlayer(team: number, slot: number): Player | undefined {
        const playerTeam = this.#players[team];
        if (playerTeam) {
            return new Player(this.#client, this.#players[team][slot]);
        }

        return undefined;
    }
}

export type PlayerEvents = {
    /**
     * Fires when a player updates their alias.
     * @param player The {@link Player} for this player with the changes applied.
     * @param oldAlias The player's previous alias.
     * @param newAlias The player's new alias.
     */
    aliasUpdated: [player: Player, oldAlias: string, newAlias: string]
};

/**
 * A collection of metadata and helper methods for interacting with a particular player.
 */
export class Player {
    #client: Client;
    #player: NetworkPlayer;

    /**
     * Instantiates a new PlayerMetadata.
     * @internal
     * @param client The Archipelago client associated with this manager.
     * @param player The network player data from the network protocol.
     */
    public constructor(client: Client, player: NetworkPlayer) {
        this.#client = client;
        this.#player = player;
    }

    /** Returns the alias for this player. */
    public toString(): string {
        return this.alias;
    }

    /** Returns the slot name for this player slot. */
    public get name(): string {
        return this.#player.name;
    }

    /** Returns the current nickname for this player or the slot name if not set. */
    public get alias(): string {
        return this.#player.alias;
    }

    /** Returns the game this slot is playing. */
    public get game(): string {
        if (this.slot === 0) {
            return "Archipelago";
        }

        return this.#networkSlot.game;
    }

    /** Returns the type of slot this player is. See {@link slotTypes} for more information. */
    public get type(): typeof slotTypes[keyof typeof slotTypes] {
        if (this.slot === 0) {
            return slotTypes.spectator;
        }

        return this.#networkSlot.type;
    }

    /** Returns the team id this player is a member of. */
    public get team(): number {
        return this.#player.team;
    }

    /** Returns this slot's id. */
    public get slot(): number {
        return this.#player.slot;
    }

    /** If this player is a group, returns all members. Otherwise, returns `null`. */
    public get members(): Player[] | null {
        if (this.type !== slotTypes.group) {
            return null;
        }

        return this.#client.players.teams[this.team].reduce((members, player) => {
            if (this.#networkSlot.group_members.includes(player.slot)) {
                members.push(player);
            }

            return members;
        }, [] as Player[]);
    }

    /** Returns all the groups this player is a member of. */
    public get groups(): Player[] {
        if (this.slot === 0) {
            return [];
        }

        return this.#client.players.teams[this.team].reduce((groups, player) => {
            // Don't bother checking slot #0.
            if (player.slot === 0) {
                return groups;
            }

            if (this.#client.players.slots[player.slot].group_members.includes(this.slot)) {
                groups.push(player);
            }

            return groups;
        }, [] as Player[]);
    }

    /** Returns this slot's current status. See {@link clientStatuses} for more information. */
    public async fetchStatus(): Promise<ClientStatus> {
        // All spectators are completed.
        if (this.type === slotTypes.group) {
            return clientStatuses.goal;
        }

        return await this.#client.storage.get<ClientStatus>(`_read_client_status_${this.team}_${this.slot}`) ?? 0;
    }

    /**
     * Fetch this player's slot data over the network.
     * @template T The type of the slot data that is returned, for better typing information.
     * @remarks This data is not tracked after running, so slot data should be cached to reduce additional network
     * calls, if necessary.
     */
    public async fetchSlotData<SlotData extends UnknownSlotData>(): Promise<SlotData> {
        if (this.slot === 0) {
            throw new Error("Cannot fetch slot data for Archipelago slot; not a real player.");
        }

        return await this.#client.storage.get<SlotData>(`_read_slot_data_${this.slot}`);
    }

    get #networkSlot(): NetworkSlot {
        return this.#client.players.slots[this.slot];
    }

    /** Fetch this player's current hints. */
    public async fetchHints(): Promise<Hint[]> {
        const hints = await this.#client.storage.get<NetworkHint[]>(`_read_hints_${this.team}_${this.slot}`);
        return hints.map((hint) => new Hint(this.#client, hint));
    }
}
