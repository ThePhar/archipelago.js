import { ArchipelagoClient } from "@structs";

export class LocationsManager {
    private _client: ArchipelagoClient;

    public constructor(client: ArchipelagoClient) {
        this._client = client;
    }
}
