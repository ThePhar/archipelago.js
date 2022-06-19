import { Client } from "../index";
/**
 * Managers and watches for events regarding item data and provides helper functions to make working with
 * items easier.
 */
export declare class ItemsManager {
    private _client;
    /**
     * Creates a new {@link ItemsManager} and sets up events on the {@link Client} to listen for to start
     * updating it's internal state.
     *
     * @param client The {@link Client} that should be managing this manager.
     */
    constructor(client: Client);
    /**
     * Returns the `name` of a given item `id`.
     *
     * @param itemId The `id` of an item. Returns "Unknown Item #" if the item does not exist in the data package.
     */
    name(itemId: number): string;
}
//# sourceMappingURL=ItemsManager.d.ts.map