import { ArchipelagoClient } from "@structs";

export class ItemsManager {
    private _client: ArchipelagoClient;

    public constructor(client: ArchipelagoClient) {
        this._client = client;
    }
}
