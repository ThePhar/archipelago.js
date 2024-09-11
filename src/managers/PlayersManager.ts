import { NetworkPlayer, SlotType } from "../api";
import { ConnectedPacket, RoomUpdatePacket } from "../api/packets";
import { ArchipelagoClient } from "../structs/ArchipelagoClient.ts";

/**
 * Managers tracking and updating all players in the room session.
 */
export class PlayersManager {
    readonly #client: ArchipelagoClient;
    readonly #players: { [team: number]: PlayerMetadata[] } = {};

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

            for (const player of packet.players) {
                // Check if team exists, and if not prepare it.
                if (!this.#players[player.team]) {
                    this.#players[player.team] = [this.#generateArchipelagoSlot(player.team)];
                }

                // Create metadata for this player.
                this.#players[player.team][player.slot] = new PlayerMetadata(this.#client, player);
            }
        };

        this.#client.api.subscribe("onConnected", onUpdate);
        this.#client.api.subscribe("onRoomUpdate", onUpdate);
    }

    /** Returns all teams and their respective players in the current session. */
    public get teams(): { [team: number]: PlayerMetadata[] } {
        const teams: { [team: number]: PlayerMetadata[] } = {};
        for (const team in this.#players) {
            teams[team] = [...this.#players[team]];
        }

        return teams;
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
            throw Error("Cannot access game information on Archipelago slot; not a real player.");
        }

        return this.#client.room.slots[this.slot].game;
    }

    /** Returns the type of slot this player is. See {@link SlotType} for more information. */
    public get type(): SlotType {
        if (this.slot === 0) {
            throw Error("Cannot access type information on Archipelago slot; not a real player.");
        }

        return this.#client.room.slots[this.slot].type;
    }

    /** Returns the team id this player is a member of. */
    public get team(): number {
        return this.#player.team;
    }

    /** Returns this slot's id. */
    public get slot(): number {
        return this.#player.slot;
    }
}
