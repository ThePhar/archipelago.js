import { Client } from "../Client";
import { SetOperationsBuilder } from "../builders/SetOperationsBuilder";
import { SERVER_PACKET_TYPE } from "../consts/CommandPacketType";
import { PERMISSION, Permissions } from "../consts/Permission";
import { SLOT_TYPE } from "../consts/SlotType";
import { ConnectedPacket } from "../packets/ConnectedPacket";
import { DataPackagePacket } from "../packets/DataPackagePacket";
import { RoomInfoPacket } from "../packets/RoomInfoPacket";
import { RoomUpdatePacket } from "../packets/RoomUpdatePacket";
import { SetReplyPacket } from "../packets/SetReplyPacket";
import { GamePackage, NetworkSlot, Player } from "../types";

/**
 * Manages and watches for events regarding session data and the data package. Most other mangers use this information
 * to create helper functions and track other information.
 */
export class DataManager<TSlotData> {
    #client: Client<TSlotData>;
    #dataPackage = new Map<string, GamePackage>();
    #players: Player[] = [];
    #games: string[] = [];
    #hintCost = 0;
    #hintPoints = 0;
    #slotData: TSlotData = {} as TSlotData;
    #slot = -1;
    #team = -1;
    #seed = "";
    #awaitingSetReplies: AwaitSetReply[] = [];
    #permissions: Permissions = {
        release: PERMISSION.DISABLED,
        collect: PERMISSION.DISABLED,
        remaining: PERMISSION.DISABLED,
    };

    /**
     * Creates a new {@link DataManager} and sets up events on the {@link Client} to listen for to start
     * updating its internal state.
     * @param client The {@link Client} that should be managing this manager.
     */
    public constructor(client: Client<TSlotData>) {
        this.#client = client;
        this.#client.addListener(SERVER_PACKET_TYPE.DATA_PACKAGE, this.#onDataPackage.bind(this));
        this.#client.addListener(SERVER_PACKET_TYPE.CONNECTED, this.#onConnected.bind(this));
        this.#client.addListener(SERVER_PACKET_TYPE.ROOM_INFO, this.#onRoomInfo.bind(this));
        this.#client.addListener(SERVER_PACKET_TYPE.ROOM_UPDATE, this.#onRoomUpdate.bind(this));
        this.#client.addListener(SERVER_PACKET_TYPE.SET_REPLY, this.#onSetReply.bind(this));
    }

    /**
     * Returns a map of all {@link GamePackage} mapped to their game `name`.
     */
    public get package(): ReadonlyMap<string, GamePackage> {
        return this.#dataPackage;
    }

    /**
     * Returns an array of all `players`, keyed by player id.
     */
    public get players(): ReadonlyArray<Player> {
        return this.#players;
    }

    /**
     * Returns an array of all games that exist in this room.
     */
    public get games(): string[] {
        return this.#games;
    }

    /**
     * Returns how many hint points a player needs to spend to receive a hint.
     */
    public get hintCost(): number {
        return this.#hintCost;
    }

    /**
     * Returns how many hint points a player has.
     */
    public get hintPoints(): number {
        return this.#hintPoints;
    }

    /**
     * Returns the slot data for this game. Will be `undefined` if no connection has been established.
     */
    public get slotData(): TSlotData {
        return this.#slotData;
    }

    /**
     * Returns this player's slot. Returns `-1` if player is not connected.
     */
    public get slot(): number {
        return this.#slot;
    }

    /**
     * Returns this player's team. Returns `-1` if player is not connected.
     */
    public get team(): number {
        return this.#team;
    }

    /**
     * Return the seed for this room.
     */
    public get seed(): string {
        return this.#seed;
    }

    /**
     * Get the current permissions for the room.
     */
    public get permissions(): Permissions {
        return this.#permissions;
    }

    /**
     * Send a series of set operations to the server. Promise returns a {@link SetReplyPacket} if `want_reply` was
     * requested.
     *
     * @param setOperation The set builder to do operations on the data storage.
     */
    public async set(setOperation: SetOperationsBuilder): Promise<SetReplyPacket | void> {
        const packet = setOperation.build();

        if (packet.want_reply) {
            return new Promise<SetReplyPacket>((resolve) => {
                this.#awaitingSetReplies.push({ key: packet.key, resolve });
                this.#client.send(packet);
            });
        } else {
            this.#client.send(packet);
        }
    }

    #onSetReply(packet: SetReplyPacket) {
        const replyIndex = this.#awaitingSetReplies.findIndex((s) => s.key === packet.key);
        if (replyIndex !== -1) {
            const { resolve } = this.#awaitingSetReplies[replyIndex] as AwaitSetReply;

            // Remove the "await".
            this.#awaitingSetReplies.splice(replyIndex, 1);
            resolve(packet as SetReplyPacket);
        }
    }

    #onDataPackage(packet: DataPackagePacket): void {
        // TODO: Cache results.
        for (const game in packet.data.games) {
            const data = packet.data.games[game] as GamePackage;
            this.#dataPackage.set(game, data);
            let createItemNameGroup = false;
            let createLocationNameGroup = false;

            // Check if these fields exist, if not, let's add them.
            if (!data.item_name_groups) {
                data.item_name_groups = { Everything: [] };
                createItemNameGroup = true;
            }
            if (!data.location_name_groups) {
                data.location_name_groups = { Everywhere: [] };
                createLocationNameGroup = true;
            }

            // Build reverse lookups for items and locations. (also add to Everywhere and Everything group if needed)
            data.location_id_to_name = {};
            data.item_id_to_name = {};
            for (const [name, id] of Object.entries(data.location_name_to_id)) {
                data.location_id_to_name[id] = name;
                if (createLocationNameGroup) {
                    (data.location_name_groups["Everywhere"] as string[]).push(name);
                }
            }
            for (const [name, id] of Object.entries(data.item_name_to_id)) {
                data.item_id_to_name[id] = name;
                if (createItemNameGroup) {
                    (data.item_name_groups["Everything"] as string[]).push(name);
                }
            }
        }
    }

    #onConnected(packet: ConnectedPacket): void {
        // Archipelago player for slot 0 is implicitly the server.
        const players: Player[] = [
            {
                name: "Archipelago",
                slot: 0,
                game: "Archipelago",
                team: 0,
                type: SLOT_TYPE.SPECTATOR,
                alias: "Archipelago",
                group_members: [],
                item: (id) => this.#client.items.name(0, id),
                location: (id) => this.#client.locations.name(0, id),
            },
        ];

        // Add all players.
        for (const networkPlayer of packet.players) {
            const player: Player = {
                ...networkPlayer,
                // Can always assume this info will be filled out.
                ...(packet.slot_info[networkPlayer.slot] as NetworkSlot),
                item: (id) => this.#client.items.name(networkPlayer.slot, id),
                location: (id) => this.#client.locations.name(networkPlayer.slot, id),
            };

            players[player.slot] = player;
        }

        this.#players = players;
        this.#slot = packet.slot;
        this.#team = packet.team;
        this.#hintPoints = packet.hint_points ?? 0;
        this.#slotData = packet.slot_data as TSlotData;

        // 1.2.0 change - Log version to data storage for debugging purposes.
        const key = `${packet.slot_info[packet.slot]?.game}:1.2.0:${navigator?.userAgent}`;
        void this.set(new SetOperationsBuilder("archipelago.js__runtimes", {}, false).update({ [key]: true }));
    }

    #onRoomInfo(packet: RoomInfoPacket): void {
        this.#seed = packet.seed_name;
        this.#hintCost = packet.hint_cost;
        this.#permissions = packet.permissions;
        this.#games = packet.games;

        // We are ready to finalize connection.
        this.#client.emitRawEvent("__onRoomInfoLoaded");
    }

    #onRoomUpdate(packet: RoomUpdatePacket): void {
        if (packet.hint_points) {
            this.#hintPoints = packet.hint_points;
        }

        if (packet.hint_cost) {
            this.#hintCost = packet.hint_cost;
        }

        if (packet.permissions) {
            this.#permissions = packet.permissions;
        }

        if (packet.players) {
            for (const player of packet.players) {
                this.#players[player.slot] = { ...this.#players[player.slot], ...player } as Player;
            }
        }
    }
}

/**
 * A helper object for awaiting a key to return from a Set request.
 */
export type AwaitSetReply = {
    key: string;
    resolve: (value: PromiseLike<SetReplyPacket> | SetReplyPacket) => void;
};
