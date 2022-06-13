import {
    ConnectedPacket,
    ConnectionRefusedPacket,
    DataPackagePacket,
    InvalidPacketPacket,
    PrintJSONPacket,
    PrintPacket,
} from "../interfaces/packets";
import { ArchipelagoClient } from "../ArchipelagoClient";

export class SessionManager {
    #client: ArchipelagoClient;

    public constructor(client: ArchipelagoClient) {
        this.#client = client;
    }

    public onConnectionRefused(packet: ConnectionRefusedPacket): void {}

    public onConnected(packet: ConnectedPacket): void {}

    public onPrint(packet: PrintPacket) {}

    public onPrintJSON(packet: PrintJSONPacket) {}

    public onDataPackage(packet: DataPackagePacket) {}

    public onInvalidPacket(packet: InvalidPacketPacket) {}
}
