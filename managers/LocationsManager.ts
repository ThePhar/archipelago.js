import { LocationInfoPacket } from "../interfaces/packets";
import { ArchipelagoClient } from "../ArchipelagoClient";

export class LocationsManager {
    #client: ArchipelagoClient;

    public constructor(client: ArchipelagoClient) {
        this.#client = client;
    }

    public onLocationInfo(packet: LocationInfoPacket) {}
}
