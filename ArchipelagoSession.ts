import * as Packet from "./interfaces/packets";
import { ConnectPacket } from "./interfaces/packets";
import { client as WebSocketClient, connection, Message } from "websocket";
import { SessionStatus } from "./enums/SessionStatus";
import { APBasePacket, NetworkVersion } from "./interfaces";

export class ArchipelagoSession {
    readonly #timeout = 5000;
    readonly #uri: string;
    #client = new WebSocketClient();
    #socket?: connection;
    #status = SessionStatus.DISCONNECTED;

    private constructor(address: string) {
        // TODO: Do validation on this, to ensure it matches what we expect hostnames to look like.
        this.#uri = `ws://${address}/`;
    }

    /**
     * Gets the current websocket connection status for this session.
     */
    public get status(): SessionStatus {
        return this.#status;
    }

    /**
     * Creates a new ArchipelagoSession object to facilitate communication with the Archipelago server.
     * @param address The complete IP address/hostname + port to the Archipelago server. e.g.: `archipelago.gg:38281`
     */
    public static createSession(address: string): ArchipelagoSession {
        return new ArchipelagoSession(address);
    }

    /**
     * Connects to the given address with given connection information.
     * @param game The name of the game this client is connecting from.
     * @param name The name of the player for this client.
     * @param password The password for the room.
     * @param version The AP protocol version supported by this client.
     * @param tags Tells the server which tags to subscribe to for bounce packets. If omitted, sends an empty tag list.
     * @param itemsHandling Tells the server which ReceivedItems packets to listen for. If omitted, game is considered
     * fully remote.
     */
    public async connect(
        game: string,
        name: string,
        password: string,
        version: NetworkVersion,
        tags?: string[],
        itemsHandling?: number,
    ): Promise<void> {
        // First establish the initial connection.
        this.#status = SessionStatus.CONNECTING;
        this.#socket = await new Promise<connection>((resolve, reject) => {
            // On successful connection.
            this.#client.on("connect", (socket) => {
                this.#status = SessionStatus.CONNECTED;

                // Establish event handlers.
                socket.on("message", this.onMessage);
                resolve(socket);
            });

            // On unsuccessful connection.
            this.#client.on("connectFailed", (error) => {
                this.#status = SessionStatus.DISCONNECTED;
                reject(error);
            });

            // Connect and await room info.
            this.#client.connect(this.#uri, undefined, undefined, undefined, { timeout: this.#timeout });
        });

        // We should be connected at this point, so let's go ahead and attempt to connect to the AP server.
        this.send(new ConnectPacket(game, name, password, version, tags, itemsHandling));
    }

    /**
     * Send a list of packets to the Archipelago server in the order they are defined.
     * @param packets A list of packets to send to the AP server. They are processed in the order they are defined in
     * this list.
     */
    public send(...packets: APBasePacket[]): void {
        if (this.#socket !== undefined && this.status === SessionStatus.CONNECTED) {
            this.#socket.send(JSON.stringify(packets));
        }
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
