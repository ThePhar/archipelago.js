import { ConnectedPacket, DataPackagePacket, RoomUpdatePacket } from "@packets";
import { ArchipelagoClient, GameData, NetworkPlayer } from "@structs";

export class DataManager {
    private _client: ArchipelagoClient;
    private _dataPackage = new Map<string, GameData>();
    private _locations = new Map<number, string>();
    private _items = new Map<number, string>();
    private _players = new Map<number, NetworkPlayer>();

    public constructor(client: ArchipelagoClient) {
        this._client = client;
        this._client.addListener("dataPackage", this.onDataPackage.bind(this));
        this._client.addListener("connected", this.onConnected.bind(this));
        this._client.addListener("roomUpdate", this.onRoomUpdate.bind(this));
    }

    /**
     * Returns a map of all game data mapped to their game name.
     */
    public get package(): ReadonlyMap<string, GameData> {
        return this._dataPackage;
    }

    /**
     * Returns a map of all location names mapped to their id.
     */
    public get locations(): ReadonlyMap<number, string> {
        return this._locations;
    }

    /**
     * Returns a map of all item names mapped to their id.
     */
    public get items(): ReadonlyMap<number, string> {
        return this._items;
    }

    /**
     * Returns a map of all players mapped to their slot id.
     */
    public get players(): ReadonlyMap<number, NetworkPlayer> {
        return this._players;
    }

    private onDataPackage(packet: DataPackagePacket): void {
        // TODO: Cache results.
        for (const game in packet.data.games) {
            const data = packet.data.games[game];
            this._dataPackage.set(game, data);

            // Fill locations map.
            for (const location in data.location_name_to_id) {
                this._locations.set(data.location_name_to_id[location], location);
            }

            // Fill items map.
            for (const item in data.item_name_to_id) {
                this._items.set(data.item_name_to_id[item], item);
            }
        }
    }

    private onConnected(packet: ConnectedPacket): void {
        for (const player of packet.players) {
            this._players.set(player.slot, player);
        }
    }

    private onRoomUpdate(packet: RoomUpdatePacket): void {
        if (!packet.players) return;

        for (const player of packet.players) {
            this._players.set(player.slot, player);
        }
    }
}
