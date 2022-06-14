import { DataPackagePacket } from "@packets";
import { ArchipelagoClient, GameData } from "@structs";

export class DataManager {
    private _client: ArchipelagoClient;
    private _dataPackage = new Map<string, GameData>();

    public constructor(client: ArchipelagoClient) {
        this._client = client;
        this._client.addListener("dataPackage", this.onDataPackage.bind(this));
    }

    /**
     * Returns a map of all DataPackage game data.
     */
    public get dataPackage(): ReadonlyMap<string, GameData> {
        return this._dataPackage;
    }

    private onDataPackage(packet: DataPackagePacket): void {
        for (const game in packet.data.games) {
            // Update the datapackage whenever we receive a new data package.
            // TODO: Cache results.
            this._dataPackage.set(game, packet.data.games[game]);
        }
    }
}
