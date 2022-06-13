import { ArchipelagoClient } from "@structs";

export class LocationsManager {
    #client: ArchipelagoClient;

    public constructor(client: ArchipelagoClient) {
        this.#client = client;
    }
}
