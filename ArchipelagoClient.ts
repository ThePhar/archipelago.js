import EventEmitter from "events";
import * as Packet from "./interfaces/packets";
import { client as WebSocket, connection as Connection, IUtf8Message, Message } from "websocket";
import { APBasePacket, NetworkVersion } from "./interfaces";
import { BounceManager, DataManager, ItemsManager, LocationsManager, RoomManager, SessionManager } from "./managers";
import { SessionStatus } from "./enums/SessionStatus";

export class ArchipelagoClient {
    readonly #uri: string;
    readonly #version: NetworkVersion;

    #socket = new WebSocket();
    #connection?: Connection;
    #status = SessionStatus.DISCONNECTED;
    #emitter = new EventEmitter();
    #bounceManager = new BounceManager(this);
    #dataManager = new DataManager(this);
    #itemsManager = new ItemsManager(this);
    #locationsManager = new LocationsManager(this);
    #roomManager = new RoomManager(this);
    #sessionManager = new SessionManager(this);

    /**
     * Create a new client for connecting to Archipelago servers.
     * @param address The hostname and port to connect to.
     * @param version The version of the Archipelago protocol this client supports.
     */
    public constructor(address: string, version: NetworkVersion) {
        // TODO: Do validation on this, to ensure it matches what we expect hostnames to look like.
        this.#uri = `ws://${address}/`;
        this.#version = version;

        // For debugging purposes, let's log all packets as they come in.
        this.addListener("packetReceived", (packet) => console.log(packet));
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
     * Connects to the given address with given connection information.
     * @param game The name of the game this client is connecting from.
     * @param name The name of the player for this client.
     * @param password The password for the room.
     * @param tags Tells the server which tags to subscribe to for bounce packets. If omitted, sends an empty tag list.
     * @param itemsHandling Tells the server which ReceivedItems packets to listen for. If omitted, game is considered
     * fully remote.
     */
    public async connect(game: string, name: string, password: string, tags?: string[], itemsHandling?: number) {
        // First establish the initial connection.
        this.#status = SessionStatus.CONNECTING;
        this.#connection = await new Promise<Connection>((resolve, reject) => {
            // On successful connection.
            this.#socket.on("connect", (connection) => {
                this.#status = SessionStatus.CONNECTED;
                connection.on("message", this.parsePackets.bind(this));
                resolve(connection);
            });

            // On unsuccessful connection.
            this.#socket.on("connectFailed", (error) => {
                this.#status = SessionStatus.DISCONNECTED;
                reject(error);
            });

            // Connect.
            this.#socket.connect(this.#uri);
        });

        // We should be connected at this point, so let's go ahead and attempt to connect to the AP server.
        this.send(new Packet.ConnectPacket(game, name, password, this.#version, tags, itemsHandling));
    }

    /**
     * Send a list of packets to the Archipelago server in the order they are defined.
     * @param packets A list of packets to send to the AP server. They are processed in the order they are defined in
     * this list.
     */
    public send(...packets: APBasePacket[]): void {
        if (this.#connection !== undefined && this.status === SessionStatus.CONNECTED) {
            this.#connection.send(JSON.stringify(packets));
        }
    }

    /**
     * Disconnect from the server and re-initialize any managers.
     */
    public disconnect(): void {
        this.#connection?.close(0, "Disconnecting");
        this.#connection = undefined;
        this.#status = SessionStatus.DISCONNECTED;

        // Clear our event listeners.
        this.#emitter.removeAllListeners("packetReceived");

        // Re-initialize Managers and prepare any old ones for garbage collection.
        this.#bounceManager = new BounceManager(this);
        this.#dataManager = new DataManager(this);
        this.#itemsManager = new ItemsManager(this);
        this.#locationsManager = new LocationsManager(this);
        this.#roomManager = new RoomManager(this);
        this.#sessionManager = new SessionManager(this);
    }

    /**
     * Add an eventListener to fire depending on an event from the Archipelago server.
     * @param event The event to listen for.
     * @param listener The listener callback function to run when a packet is received.
     */
    public addListener(event: "packetReceived", listener: (packet: APBasePacket) => void): void {
        if (event !== "packetReceived") return;

        this.#emitter.addListener("packetReceived", listener);
    }

    /**
     * Remove an eventListener from this client's event emitter.
     * @param event The event to stop listening to.
     * @param listener The listener callback function to remove.
     */
    public removeListener(event: "packetReceived", listener: EventListener): void {
        if (event !== "packetReceived") return;

        this.#emitter.removeListener("packetReceived", listener);
    }

    private parsePackets(buffer: Message): void {
        if (buffer.type !== "utf8") return;

        // Parse packets and fire our packetReceived event for each packet.
        const packets = JSON.parse(buffer.utf8Data) as APBasePacket[];
        for (const packet of packets) {
            this.#emitter.emit("packetReceived", packet);
        }
    }
}
