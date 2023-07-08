import { Client, NetworkSlot, Permission, RoomInfoPacket, ServerPacketType, SetReplyPacket } from "../index";
import { ConnectedPacket, DataPackagePacket, RoomUpdatePacket } from "../packets";
import { GameData } from "../structs";
import { SetOperationsBuilder } from "../structs/SetOperationsBuilder";
import { Player } from "../structs/Player";

/**
 * Manages and watches for events regarding session data and the data package. Most other mangers use this information
 * to create helper functions and track other information.
 */
export class DataManager<TSlotData> {
    #client: Client<TSlotData>;
    #dataPackage = new Map<string, GameData>();
    #players = new Map<number, Player>();
    #hintCost = 0;
    #hintPoints = 0;
    #slotData: TSlotData = {} as TSlotData;
    #slot = -1;
    #team = -1;
    #seed = "";
    #awaitingSetReplies: AwaitSetReply[] = [];
    #permissions: Permissions = {
        release: Permission.DISABLED,
        collect: Permission.DISABLED,
        remaining: Permission.DISABLED,
    };

    /**
     * Creates a new {@link DataManager} and sets up events on the {@link Client} to listen for to start
     * updating its internal state.
     * @param client The {@link Client} that should be managing this manager.
     */
    public constructor(client: Client<TSlotData>) {
        this.#client = client;
        this.#client.addListener(ServerPacketType.DATA_PACKAGE, this.#onDataPackage.bind(this));
        this.#client.addListener(ServerPacketType.CONNECTED, this.#onConnected.bind(this));
        this.#client.addListener(ServerPacketType.ROOM_INFO, this.#onRoomInfo.bind(this));
        this.#client.addListener(ServerPacketType.ROOM_UPDATE, this.#onRoomUpdate.bind(this));
        this.#client.addListener(ServerPacketType.SET_REPLY, this.#onSetReply.bind(this));
    }

    /**
     * Returns a map of all {@link GameData} mapped to their game `name`.
     */
    public get package(): ReadonlyMap<string, GameData> {
        return this.#dataPackage;
    }

    /**
     * Returns a map of all `players`, keyed by player id.
     */
    public get players(): ReadonlyMap<number, Player> {
        return this.#players;
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
            const data = packet.data.games[game] as GameData;
            this.#dataPackage.set(game, data);

            // Build reverse lookups for items and locations.
            data.location_id_to_name = {};
            data.item_id_to_name = {};
            for (const [name, id] of Object.entries(data.location_name_to_id)) {
                data.location_id_to_name[id] = name;
            }
            for (const [name, id] of Object.entries(data.item_name_to_id)) {
                data.item_id_to_name[id] = name;
            }
        }
    }

    #onConnected(packet: ConnectedPacket): void {
        for (const networkPlayer of packet.players) {
            const player: Player = {
                ...networkPlayer,
                // Can always assume this info will be filled out.
                ...(packet.slot_info[networkPlayer.slot] as NetworkSlot),
            };

            this.#players.set(player.slot, player);
        }

        this.#slot = packet.slot;
        this.#hintPoints = packet.hint_points ?? 0;
        this.#slotData = packet.slot_data as TSlotData;
    }

    #onRoomInfo(packet: RoomInfoPacket): void {
        this.#seed = packet.seed_name;
        this.#hintCost = packet.hint_cost;
        this.#permissions = packet.permissions;
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
            for (const networkPlayer of packet.players) {
                const player = this.#players.get(networkPlayer.slot) as Player;
                this.#players.set(player.slot, { ...player, ...networkPlayer });
            }
        }
    }
}

/**
 * All three {@link Permission} values for a given room.
 */
export type Permissions = {
    readonly release: Permission;
    readonly collect: Permission;
    readonly remaining: Permission;
}

/**
 * A helper object for awaiting a key to return from a Set request.
 */
export type AwaitSetReply = {
    key: string,
    resolve: (value: (PromiseLike<SetReplyPacket> | SetReplyPacket)) => void,
};
