import { ArchipelagoClient } from "../structs/ArchipelagoClient.ts";

export class ChatManager {
    readonly #client: ArchipelagoClient;

    /**
     * Instantiates a new ChatManager.
     * @internal
     * @param client The Archipelago client associated with this manager.
     */
    public constructor(client: ArchipelagoClient) {
        this.#client = client;
    }
}
