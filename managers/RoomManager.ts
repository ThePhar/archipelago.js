import { RoomInfoPacket, RoomUpdatePacket } from "../interfaces/packets";
import { ArchipelagoClient } from "../ArchipelagoClient";

export class RoomManager {
    #client: ArchipelagoClient;

    public constructor(client: ArchipelagoClient) {
        this.#client = client;
    }

    public onRoomInfo(packet: RoomInfoPacket) {}

    public onRoomUpdate(packet: RoomUpdatePacket) {}
}
