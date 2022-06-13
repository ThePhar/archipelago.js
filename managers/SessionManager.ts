import { ConnectedPacket, ConnectionRefusedPacket } from "../interfaces/packets";

export class SessionManager {
    public onConnectionRefused(packet: ConnectionRefusedPacket): void {}
    public onConnected(packet: ConnectedPacket): void {}
}
