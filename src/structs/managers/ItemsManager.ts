import { ArchipelagoClient } from "@structs";

export class ItemsManager {
    private _client: ArchipelagoClient;

    public constructor(client: ArchipelagoClient) {
        this._client = client;
    }

    /**
     * Returns the name of a given item id.
     * @param itemId
     */
    public name(itemId: number): string {
        return this._client.data.items.get(itemId) ?? `Unknown Item ${itemId}`;
    }
}
