import { ArchipelagoClient } from "../structs/ArchipelagoClient.ts";

/**
 * @todo Implement functionality.
 */
export class ItemsManager {
    readonly #client: ArchipelagoClient;

    /**
     * Instantiates a new ItemsManager.
     * @internal
     * @param client The Archipelago client associated with this manager.
     */
    public constructor(client: ArchipelagoClient) {
        this.#client = client;
    }
}
