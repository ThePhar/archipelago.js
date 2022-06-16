import { ArchipelagoClient } from "../index";

/**
 * Managers and watches for events regarding item data and provides helper functions to make working with items easier.
 */
export class ItemsManager {
    private _client: ArchipelagoClient;

    /**
     * Creates a new {@link ItemsManager} and sets up events on the {@link ArchipelagoClient} to listen for to start
     * updating it's internal state.
     *
     * @param client The {@link ArchipelagoClient} that should be managing this manager.
     */
    public constructor(client: ArchipelagoClient) {
        this._client = client;
    }

    /**
     * Returns the `name` of a given item `id`.
     *
     * @param itemId The `id` of an item. Returns "Unknown Item #" if the item does not exist in the data package.
     */
    public name(itemId: number): string {
        return this._client.data.items.get(itemId) ?? `Unknown Item ${itemId}`;
    }
}
