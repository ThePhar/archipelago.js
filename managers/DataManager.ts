import { RetrievedPacket, SetReplyPacket } from "../interfaces/packets";
import { ArchipelagoClient } from "../ArchipelagoClient";

export class DataManager {
    #client: ArchipelagoClient;

    public constructor(client: ArchipelagoClient) {
        this.#client = client;
    }
    public onReterieved(packet: RetrievedPacket) {}

    public onSetReply(packet: SetReplyPacket) {}
}
