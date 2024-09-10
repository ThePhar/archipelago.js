import { ArchipelagoClient } from "../ArchipelagoClient.ts";

export class RoomManager {
    readonly #client: ArchipelagoClient;

    /**
     * Instantiates a new RoomManager.
     * @internal
     * @param client The Archipelago client associated with this manager.
     */
    public constructor(client: ArchipelagoClient) {
        this.#client = client;
    }
}
