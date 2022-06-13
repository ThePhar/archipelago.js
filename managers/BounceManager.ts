import { BouncedPacket } from "../interfaces/packets";
import { ArchipelagoClient } from "../ArchipelagoClient";

export class BounceManager {
    #client: ArchipelagoClient;

    public constructor(client: ArchipelagoClient) {
        this.#client = client;
    }

    public onBounced(packet: BouncedPacket) {}
}
