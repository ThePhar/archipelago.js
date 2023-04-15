import { ArchipelagoClient, Permission, RoomInfoPacket } from "../index";
import { ConnectedPacket, DataPackagePacket, RoomUpdatePacket } from "../packets";
import { GameData, NetworkPlayer } from "../structs";

/**
 * Manages and watches for events regarding session data and the data package. Most other mangers use this information
 * to create helper functions and track other information.
 */
export class DataManager<TSlotData> {
    private _client: ArchipelagoClient<TSlotData>;
    private _dataPackage = new Map<string, GameData>();
    private _locations = new Map<number, string>();
    private _items = new Map<number, string>();
    private _players = new Map<number, NetworkPlayer>();
    private _hintCost = 0;
    private _hintPoints = 0;
    private _slotData: TSlotData = {} as TSlotData;
    private _slot = -1;
    private _seed = "";
    private _permissions: Permissions = {
        release: Permission.DISABLED,
        collect: Permission.DISABLED,
        remaining: Permission.DISABLED,
    };

    /**
     * Creates a new {@link DataManager} and sets up events on the {@link ArchipelagoClient} to listen for to start
     * updating its internal state.
     * @param client The {@link ArchipelagoClient} that should be managing this manager.
     */
    public constructor(client: ArchipelagoClient<TSlotData>) {
        this._client = client;
        this._client.addListener("dataPackage", this.onDataPackage.bind(this));
        this._client.addListener("connected", this.onConnected.bind(this));
        this._client.addListener("roomInfo", this.onRoomInfo.bind(this));
        this._client.addListener("roomUpdate", this.onRoomUpdate.bind(this));
    }

    /**
     * Returns a map of all {@link GameData} mapped to their game `name`.
     */
    public get package(): ReadonlyMap<string, GameData> {
        return this._dataPackage;
    }

    /**
     * Returns a map of all location `names` mapped to their `id`.
     */
    public get locations(): ReadonlyMap<number, string> {
        return this._locations;
    }

    /**
     * Returns a map of all item `names` mapped to their `id`.
     */
    public get items(): ReadonlyMap<number, string> {
        return this._items;
    }

    /**
     * Returns a map of all `players` mapped to their slot `id`.
     */
    public get players(): ReadonlyMap<number, NetworkPlayer> {
        return this._players;
    }

    /**
     * Returns how many hint points a player needs to spend to receive a hint.
     */
    public get hintCost(): number {
        return this._hintCost;
    }

    /**
     * Returns how many hint points a player has.
     */
    public get hintPoints(): number {
        return this._hintPoints;
    }

    /**
     * Returns the slot data for this game. Will be undefined if no connection has been established.
     */
    public get slotData(): TSlotData {
        return this._slotData;
    }

    /**
     * Returns this player's slot. Returns -1 if player is not connected.
     */
    public get slot(): number {
        return this._slot;
    }

    /**
     * Return the seed for this room.
     */
    public get seed(): string {
        return this._seed;
    }

    public get permissions(): Permissions {
        return this._permissions;
    }

    private onDataPackage(packet: DataPackagePacket): void {
        // TODO: Cache results.
        for (const game in packet.data.games) {
            const data = packet.data.games[game] as GameData;
            this._dataPackage.set(game, data);

            // Fill locations map.
            for (const location in data.location_name_to_id) {
                this._locations.set(data.location_name_to_id[location] as number, location);
            }

            // Fill items map.
            for (const item in data.item_name_to_id) {
                this._items.set(data.item_name_to_id[item] as number, item);
            }
        }
    }

    private onConnected(packet: ConnectedPacket): void {
        for (const player of packet.players) {
            this._players.set(player.slot, player);
        }

        this._slot = packet.slot;
        this._hintPoints = packet.hint_points ?? 0;
        this._slotData = packet.slot_data as TSlotData;
    }

    private onRoomInfo(packet: RoomInfoPacket): void {
        this._seed = packet.seed_name;
        this._hintCost = packet.hint_cost;
        this._permissions = packet.permissions;
    }

    private onRoomUpdate(packet: RoomUpdatePacket): void {
        if (packet.hint_points) {
            this._hintPoints = packet.hint_points;
        }

        if (packet.hint_cost) {
            this._hintCost = packet.hint_cost;
        }

        if (packet.permissions) {
            this._permissions = packet.permissions;
        }

        if (packet.players) {
            for (const player of packet.players) {
                this._players.set(player.slot, player);
            }
        }
    }
}

export type Permissions = {
    readonly release: Permission;
    readonly collect: Permission;
    readonly remaining: Permission;
}
