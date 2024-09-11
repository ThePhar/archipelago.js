import { AbstractSlotData, ClientStatus, NetworkPlayer, NetworkSlot, SlotType } from "../api";
import { ConnectedPacket, RoomUpdatePacket } from "../api/packets";
import { ArchipelagoClient } from "../structs/ArchipelagoClient.ts";

/**
 * Managers tracking and updating all players in the room session.
 */
export class PlayersManager {
    readonly #client: ArchipelagoClient;
    #players: { [team: number]: PlayerMetadata[] } = {};
    #slots: Record<number, NetworkSlot> = {};

    /**
     * Instantiates a new PlayersManager.
     * @internal
     * @param client The Archipelago client associated with this manager.
     */
    public constructor(client: ArchipelagoClient) {
        this.#client = client;

        const onUpdate = (packet: ConnectedPacket | RoomUpdatePacket) => {
            if (!packet.players) {
                return;
            }

            this.#players = {};
            for (const player of packet.players) {
                // Check if team exists, and if not prepare it.
                if (!this.#players[player.team]) {
                    this.#players[player.team] = [this.#generateArchipelagoSlot(player.team)];
                }

                // Create metadata for this player.
                this.#players[player.team][player.slot] = new PlayerMetadata(this.#client, player);
            }
        };

        this.#client.api.subscribe("onConnected", (packet) => {
            onUpdate(packet);

            this.#slots = packet.slot_info;

            // Watch for client statuses for each player, as well.
            const keys: string[] = [];
            for (const team in this.#players) {
                for (const player of this.#players[team]) {
                    if (player.slot === 0) continue;

                    keys.push(`_read_client_status_${player.team}_${player.slot}`);
                }
            }
            this.#client.api.send({ cmd: "SetNotify", keys });
        });
        this.#client.api.subscribe("onRoomUpdate", onUpdate);
    }

    /**
     * Returns a record of basic information for each slot.
     * @remarks Slot information is shared across each team. For accessing player data, see {@link PlayersManager}.
     */
    public get slots(): Record<number, NetworkSlot> {
        return structuredClone(this.#slots);
    }

    /** Returns all teams and their respective players in the current session. */
    public get teams(): { [team: number]: PlayerMetadata[] } {
        const teams: { [team: number]: PlayerMetadata[] } = {};
        for (const team in this.#players) {
            teams[team] = this.#players[team].slice(1);
        }

        return teams;
    }

    /**
     * Attempt to find a player by their team or slot name.
     * @param team The team id associated with the searched player.
     * @param slot The slot id associated with the searched player.
     * @returns The player's metadata or `undefined` if not found.
     */
    public findPlayer(team: number, slot: number): PlayerMetadata | undefined {
        return this.#players[team][slot];
    }

    #generateArchipelagoSlot(team: number): PlayerMetadata {
        return new PlayerMetadata(
            this.#client,
            { team, slot: 0, name: "Archipelago", alias: "Archipelago" },
        );
    }
}

/**
 * A collection of metadata and helper methods for interacting with a particular player.
 */
export class PlayerMetadata {
    #client: ArchipelagoClient;
    #player: NetworkPlayer;

    /**
     * Instantiates a new PlayerMetadata.
     * @internal
     * @param client The Archipelago client associated with this manager.
     * @param player The network player data from the network protocol.
     */
    public constructor(client: ArchipelagoClient, player: NetworkPlayer) {
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

    /**
     * @internal
     * @param value New alias.
     */
    public set alias(value: string) {
        this.#player = { ...this.#player, alias: value };
    }

    /** Returns the game this slot is playing. */
    public get game(): string {
        if (this.slot === 0) {
            return "Archipelago";
        }

        return this.#networkSlot.game;
    }

    /** Returns the type of slot this player is. See {@link SlotType} for more information. */
    public get type(): SlotType {
        if (this.slot === 0) {
            return SlotType.Spectator;
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

    /** Returns this slot's current {@link ClientStatus}. */
    public get status(): ClientStatus {
        if (this.slot === 0) {
            return 30;
        }

        return this.#client.data.storage[`_read_client_status_${this.team}_${this.slot}`] as ClientStatus ?? 0;
    }

    /** If this player is a group, returns all members. Otherwise, returns `null`. */
    public get members(): PlayerMetadata[] | null {
        if (this.type !== SlotType.Group) {
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

    /**
     * Fetch this player's slot data over the network.
     * @template T The type of the slot data that is returned, for better typing information.
     * @remarks This data is not tracked after running, so slot data should be cached to reduce additional network
     * calls, if necessary.
     */
    public async fetchSlotData<T extends AbstractSlotData = AbstractSlotData>(): Promise<T> {
        const key = `_read_slot_data_${this.slot}`;
        return new Promise<T>((resolve) => {
            void this.#client.data
                .get([key])
                .then((data) => resolve(data[key] as T));
        });
    }

    get #networkSlot(): NetworkSlot {
        return this.#client.players.slots[this.slot];
    }
}
