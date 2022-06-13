import * as Packet from "./interfaces/packets";
import { client as WebSocketClient, connection as Connection, Message } from "websocket";
import { APBasePacket, NetworkVersion } from "./interfaces";
import { BounceManager, DataManager, ItemsManager, LocationsManager, RoomManager, SessionManager } from "./managers";
import { SessionStatus } from "./enums/SessionStatus";

export class ArchipelagoSession {
    readonly #uri: string;
    #client = new WebSocketClient();
    #socket?: Connection;
    #status = SessionStatus.DISCONNECTED;

    #bounceManager: BounceManager;
    #dataManager: DataManager;
    #itemsManager: ItemsManager;
    #locationsManager: LocationsManager;
    #roomManager: RoomManager;
    #sessionManager: SessionManager;

    private constructor(address: string) {
        // TODO: Do validation on this, to ensure it matches what we expect hostnames to look like.
        this.#uri = `ws://${address}/`;

        // Instantiate our managers. TODO: Move to connection logic?
        this.#bounceManager = new BounceManager();
        this.#dataManager = new DataManager();
        this.#itemsManager = new ItemsManager();
        this.#locationsManager = new LocationsManager();
        this.#roomManager = new RoomManager();
        this.#sessionManager = new SessionManager();
    }

    public get status(): SessionStatus {
        return this.#status;
    }

    public get bounceManager(): BounceManager {
        return this.#bounceManager;
    }

    public get dataManager(): DataManager {
        return this.#dataManager;
    }

    public get itemsManager(): ItemsManager {
        return this.#itemsManager;
    }

    public get locationsManager(): LocationsManager {
        return this.#locationsManager;
    }

    public get roomManager(): RoomManager {
        return this.#roomManager;
    }

    public get sessionManager(): SessionManager {
        return this.#sessionManager;
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
        this.#socket = await new Promise<Connection>((resolve, reject) => {
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

            // Connect.
            this.#client.connect(this.#uri);
        });

        // We should be connected at this point, so let's go ahead and attempt to connect to the AP server.
        this.send(new Packet.ConnectPacket(game, name, password, version, tags, itemsHandling));
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
        // Ignore binary messages.
        if (message.type !== "utf8") return;

        // Parse the server data as a list of packets.
        const packets: APBasePacket[] = JSON.parse(message.utf8Data);

        // Delegate the processing of each type of packet to their equivalent manager.
        for (const packet of packets) {
            switch (packet.cmd) {
                // Bounce Manager (+ Death Links)
                case "Bounced":
                    this.bounceManager.onBounced(packet as Packet.BouncedPacket);
                    break;

                // Session Manager
                case "ConnectionRefused":
                    this.sessionManager.onConnectionRefused(packet as Packet.ConnectionRefusedPacket);
                    break;
                case "Connected":
                    this.sessionManager.onConnected(packet as Packet.ConnectedPacket);
                    break;
                case "Print":
                    this.sessionManager.onPrint(packet as Packet.PrintPacket);
                    break;
                case "PrintJSON":
                    this.sessionManager.onPrintJSON(packet as Packet.PrintJSONPacket);
                    break;
                case "DataPackage":
                    this.sessionManager.onDataPackage(packet as Packet.DataPackagePacket);
                    break;
                case "InvalidPacket":
                    this.sessionManager.onInvalidPacket(packet as Packet.InvalidPacketPacket);
                    break;

                // Data Manager
                case "Retrieved":
                    this.dataManager.onReterieved(packet as Packet.RetrievedPacket);
                    break;
                case "SetReply":
                    this.dataManager.onSetReply(packet as Packet.SetReplyPacket);
                    break;

                // Items Manager
                case "ReceivedItems":
                    this.itemsManager.onReceivedItems(packet as Packet.ReceivedItemsPacket);
                    break;

                // Locations Manager
                case "LocationInfo":
                    this.locationsManager.onLocationInfo(packet as Packet.LocationInfoPacket);
                    break;

                // Room Manager
                case "RoomInfo":
                    this.roomManager.onRoomInfo(packet as Packet.RoomInfoPacket);
                    break;
                case "RoomUpdate":
                    this.roomManager.onRoomUpdate(packet as Packet.RoomInfoPacket);
                    break;

                default:
                    console.warn(`Unsupported packet sent to client: ${packet.cmd}.`);
                    console.warn(packet);
                    break;
            }
        }
    }
}
