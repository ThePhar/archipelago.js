import { ArchipelagoClient } from "../ArchipelagoClient.ts";

export class DataStorageManager {
    readonly #client: ArchipelagoClient;

    /**
     * Instantiates a new DataStorageManager.
     * @internal
     * @param client The Archipelago client associated with this manager.
     */
    public constructor(client: ArchipelagoClient) {
        this.#client = client;
    }
}
