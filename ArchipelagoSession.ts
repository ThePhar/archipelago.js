import * as Packet from "./interfaces/packets";
import { client as WebSocketClient, connection, Message } from "websocket";
import { APBasePacket } from "./interfaces/__base";
import { SessionStatus } from "./enums/SessionStatus";

export class ArchipelagoSession {
    private readonly timeout = 5000;
    private readonly uri: string;

    private client = new WebSocketClient();
    private socket?: connection;
    private status = SessionStatus.DISCONNECTED;

    private constructor(address: string) {
        // TODO: Do validation on this, to ensure it matches what we expect hostnames to look like.
        this.uri = `ws://${address}/`;
    }

    /**
     * Creates a new ArchipelagoSession object to facilitate communication with the Archipelago server.
     * @param address The complete IP address/hostname + port to the Archipelago server. e.g.: `archipelago.gg:38281`
     */
    public static createSession(address: string): ArchipelagoSession {
        return new ArchipelagoSession(address);
    }

    public async connect(): Promise<void> {
        // First establish the initial connection.
        this.status = SessionStatus.CONNECTING;
        this.socket = await new Promise<connection>((resolve, reject) => {
            // On successful connection.
            this.client.on("connect", (socket) => {
                this.status = SessionStatus.CONNECTED;

                // Establish event handlers.
                socket.on("message", this.onMessage);
                resolve(socket);
            });

            // On unsuccessful connection.
            this.client.on("connectFailed", (error) => {
                this.status = SessionStatus.DISCONNECTED;
                reject(error);
            });

            // Connect and await room info.
            this.client.connect(this.uri, undefined, undefined, undefined, { timeout: this.timeout });
        });
    }

    private onMessage(message: Message): void {
        // Ignore non-utf8 messages.
        if (message.type !== "utf8") return;

        // Process message as JSON packet array.
        const packets: APBasePacket[] = JSON.parse(message.utf8Data);
        for (const packet of packets) {
            switch (packet.cmd) {
                case "RoomInfo":
                    console.log(packet as Packet.RoomInfoPacket);
                    break;
                case "ConnectionRefused":
                    console.log(packet as Packet.ConnectionRefusedPacket);
                    break;
                case "Connected":
                    console.log(packet as Packet.ConnectedPacket);
                    break;
                case "ReceivedItems":
                    console.log(packet as Packet.ReceivedItemsPacket);
                    break;
                case "LocationInfo":
                    console.log(packet as Packet.LocationInfoPacket);
                    break;
                case "RoomUpdate":
                    console.log(packet as Packet.RoomInfoPacket);
                    break;
                case "Print":
                    console.log(packet as Packet.PrintPacket);
                    break;
                case "PrintJSON":
                    console.log(packet as Packet.PrintJSONPacket);
                    break;
                case "DataPackage":
                    console.log(packet as Packet.DataPackagePacket);
                    break;
                case "Bounced":
                    console.log(packet as Packet.BouncedPacket);
                    break;
                case "InvalidPacket":
                    console.log(packet as Packet.InvalidPacketPacket);
                    break;
                case "Retrieved":
                    console.log(packet as Packet.RetrievedPacket);
                    break;
                case "SetReply":
                    console.log(packet as Packet.SetReplyPacket);
                    break;
                default:
                    console.warn(`Unsupported packet sent to client: ${packet.cmd}.`);
                    console.warn(packet);
                    break;
            }
        }
    }
}
