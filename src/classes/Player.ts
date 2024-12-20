import { clientStatuses, JSONRecord, NetworkHint, NetworkPlayer, NetworkSlot, slotTypes } from "../api";
import { Client } from "./Client.ts";
import { Hint } from "./Hint.ts";
import { ClientStatus } from "./managers/PlayersManager.ts";

/**
 * A collection of metadata and helper methods for interacting with a particular player.
 */
export class Player {
    readonly #client: Client;
    readonly #player: NetworkPlayer;

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

    /** Returns all group members of this player, if player is a group. Otherwise, returns an empty array. */
    public get members(): Player[] {
        if (this.type !== slotTypes.group) {
            return [];
        }

        return this.#client.players.teams[this.team].filter((player) => (
            this.#networkSlot.group_members.includes(player.slot)
        ));
    }

    /** Returns all the groups this player is a member of. */
    public get groups(): Player[] {
        if (this.slot === 0) {
            return [];
        }

        return this.#client.players.teams[this.team].filter((player) => (
            player.slot !== 0 && this.#client.players.slots[player.slot].group_members.includes(this.slot)
        ));
    }

    /** Returns this slot's current status. See {@link clientStatuses} for more information. */
    public async fetchStatus(): Promise<ClientStatus> {
        // All spectators are completed.
        if (this.type === slotTypes.group) {
            return clientStatuses.goal;
        }

        return await this.#client.storage.fetch<ClientStatus>(`_read_client_status_${this.team}_${this.slot}`) ?? 0;
    }

    /**
     * Fetch this player's slot data over the network.
     * @template SlotData The type of the slot data that is returned, for better typing information.
     * @remarks This data is not tracked after running, so slot data should be cached to reduce additional network
     * calls, if necessary.
     */
    public async fetchSlotData<SlotData extends JSONRecord>(): Promise<SlotData> {
        return await this.#client.storage.fetch<SlotData>(`_read_slot_data_${this.slot}`);
    }

    /** Fetch this player's current hints. */
    public async fetchHints(): Promise<Hint[]> {
        const hints = await this.#client.storage.fetch<NetworkHint[]>(`_read_hints_${this.team}_${this.slot}`);
        return hints.map((hint) => new Hint(this.#client, hint));
    }

    get #networkSlot(): NetworkSlot {
        return this.#client.players.slots[this.slot];
    }
}
