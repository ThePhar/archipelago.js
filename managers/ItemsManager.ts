import { ReceivedItemsPacket } from "../interfaces/packets";
import { ArchipelagoClient } from "../ArchipelagoClient";

export class ItemsManager {
    #client: ArchipelagoClient;

    public constructor(client: ArchipelagoClient) {
        this.#client = client;
    }

    public onReceivedItems(packet: ReceivedItemsPacket): void {}
}
