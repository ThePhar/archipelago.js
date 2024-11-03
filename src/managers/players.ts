import { clientStatuses, NetworkPlayer, NetworkSlot, slotTypes } from "../api";
import { Client, UnknownSlotData } from "../client.ts";
import { EventBasedManager } from "./abstract.ts";

/** A type alias for any known client status. See {@link clientStatuses} for more information. */
export type ClientStatus = typeof clientStatuses[keyof typeof clientStatuses];

/**
 * Managers tracking and updating all players in the room session.
 */
export class PlayersManager extends EventBasedManager<PlayerEvents> {
    readonly #client: Client;
    #players: NetworkPlayer[][] = [];
    #slots: Readonly<Record<number, NetworkSlot>> = {};
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
                        this.emit("aliasUpdated", [new PlayerMetadata(this.#client, player), oldAlias, player.alias]);
                    }
                }
            });
    }

    /** Returns the {@link PlayerMetadata} for this client's player. */
    public get self(): PlayerMetadata {
        if (!this.#client.authenticated) {
            throw new Error("Cannot lookup own player object while not authenticated to a server.");
        }

        return new PlayerMetadata(this.#client, this.#players[this.#team][this.#slot]);
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
    public get teams(): PlayerMetadata[][] {
        const players: PlayerMetadata[][] = [];
        for (let team = 0; team < this.#players.length; team++) {
            // Yes, this is as cursed as it looks.
            const proxy = new Proxy<PlayerMetadata[]>(this.#players[team] as PlayerMetadata[], {
                get: (target, slot: string) => {
                    return new PlayerMetadata(this.#client, target[parseInt(slot)]);
                },
                set: () => {
                    throw new Error("Cannot directly modify teams values.");
                },
                deleteProperty: () => {
                    throw new Error("Cannot directly modify teams values.");
                },
                setPrototypeOf: () => {
                    throw new Error("Cannot directly modify teams values.");
                },
                getPrototypeOf: () => {
                    return Object.getPrototypeOf(PlayerMetadata) as PlayerMetadata;
                },
            });

            players.push(proxy);
        }

        return players;
    }

    /**
     * Attempt to find a player by their team or slot name.
     * @param team The team id associated with the searched player.
     * @param slot The slot id associated with the searched player.
     * @returns The player's metadata or `undefined` if not found.
     */
    public findPlayer(team: number, slot: number): PlayerMetadata | undefined {
        const playerTeam = this.#players[team];
        if (playerTeam) {
            return new PlayerMetadata(this.#client, this.#players[team][slot]);
        }

        return undefined;
    }
}

export type PlayerEvents = {
    /**
     * Fires when a player updates their alias.
     * @param player The {@link PlayerMetadata} for this player with the changes applied.
     * @param oldAlias The player's previous alias.
     * @param newAlias The player's new alias.
     */
    aliasUpdated: [player: PlayerMetadata, oldAlias: string, newAlias: string]
};

/**
 * A collection of metadata and helper methods for interacting with a particular player.
 */
export class PlayerMetadata {
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
    public get members(): PlayerMetadata[] | null {
        if (this.type !== slotTypes.group) {
            return null;
        }

        return this.#client.players.teams[this.team].reduce((members, player) => {
            if (this.#networkSlot.group_members.includes(player.slot)) {
                members.push(player);
            }

            return members;
        }, [] as PlayerMetadata[]);
    }

    /** Returns all the groups this player is a member of. */
    public get groups(): PlayerMetadata[] {
        if (this.slot === 0) {
            return [];
        }

        return this.#client.players.teams[this.team].reduce((groups, player) => {
            if (this.#client.players.slots[player.slot].group_members.includes(this.slot)) {
                groups.push(player);
            }

            return groups;
        }, [] as PlayerMetadata[]);
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
}
