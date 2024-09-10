import { ArchipelagoClient } from "../ArchipelagoClient.ts";

/**
 * @todo Implement functionality.
 */
export class LocationsManager {
    readonly #client: ArchipelagoClient;

    /**
     * Instantiates a new LocationsManager.
     * @internal
     * @param client The Archipelago client associated with this manager.
     */
    public constructor(client: ArchipelagoClient) {
        this.#client = client;
    }
}
