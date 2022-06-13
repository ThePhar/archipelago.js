import EventEmitter from "events";
import { client as WebSocket, connection as Connection, Message } from "websocket";

import { ArchipelagoClientPacket, ArchipelagoServerPacket, ConnectPacket } from "@packets";
import { SessionStatus } from "@enums";
import { NetworkVersion } from "@structs";

export class ArchipelagoClient {
    private readonly _uri: string;
    private readonly _version: NetworkVersion;
    private _socket = new WebSocket();
    private _connection?: Connection;
    private _status = SessionStatus.DISCONNECTED;
    private _emitter = new EventEmitter();

    /**
     * Create a new client for connecting to Archipelago servers.
     * @param address The hostname and port to connect to.
     * @param version The version of the Archipelago protocol this client supports.
     */
    public constructor(address: string, version: NetworkVersion) {
        // There is probably a better regex than this, but make sure it looks like a valid address.
        if (!/^[^:]+:[0-9]{2,5}$/.test(address)) {
            throw new Error(`Inputted address: '${address} does not appear to be a valid address:port`);
        }

        this._uri = `ws://${address}/`;
        this._version = version;
    }

    /**
     * Get the current WebSocket connection status to the Archipelago server.
     */
    public get status(): SessionStatus {
        return this._status;
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
    public async connect(game: string, name: string, password = "", tags?: string[], itemsHandling?: number) {
        // First establish the initial connection.
        this._status = SessionStatus.CONNECTING;
        this._connection = await new Promise<Connection>((resolve, reject) => {
            // On successful connection.
            this._socket.on("connect", (connection) => {
                this._status = SessionStatus.CONNECTED;
                connection.on("message", this.parsePackets.bind(this));
                resolve(connection);
            });

            // On unsuccessful connection.
            this._socket.on("connectFailed", (error) => {
                this._status = SessionStatus.DISCONNECTED;
                reject(error);
            });

            // Connect.
            this._socket.connect(this._uri);
        });

        // We should be connected at this point, so let's go ahead and attempt to connect to the AP server.
        this.send(new ConnectPacket(game, name, password, this._version, tags, itemsHandling));
    }

    /**
     * Send a list of packets to the Archipelago server in the order they are defined.
     * @param packets A list of packets to send to the AP server. They are processed in the order they are defined in
     * this list.
     */
    public send(...packets: ArchipelagoClientPacket[]): void {
        if (this._connection !== undefined && this.status === SessionStatus.CONNECTED) {
            this._connection.send(JSON.stringify(packets));
        }
    }

    /**
     * Disconnect from the server and re-initialize any managers.
     */
    public disconnect(): void {
        this._connection?.close(0, "Disconnecting");
        this._connection = undefined;
        this._status = SessionStatus.DISCONNECTED;

        // Clear our event listeners.
        this._emitter.removeAllListeners("packetReceived");
    }

    /**
     * Add an eventListener to fire depending on an event from the Archipelago server.
     * @param event The event to listen for.
     * @param listener The listener callback function to run when a packet is received.
     */
    public addListener(event: "packetReceived", listener: (packet: ArchipelagoServerPacket) => void): void {
        if (event !== "packetReceived") return;

        this._emitter.addListener("packetReceived", listener);
    }

    /**
     * Remove an eventListener from this client's event emitter.
     * @param event The event to stop listening to.
     * @param listener The listener callback function to remove.
     */
    public removeListener(event: "packetReceived", listener: EventListener): void {
        if (event !== "packetReceived") return;

        this._emitter.removeListener("packetReceived", listener);
    }

    private parsePackets(buffer: Message): void {
        if (buffer.type !== "utf8") return;

        // Parse packets and fire our packetReceived event for each packet.
        const packets = JSON.parse(buffer.utf8Data) as ArchipelagoServerPacket[];
        for (const packet of packets) {
            this._emitter.emit("packetReceived", packet);
        }
    }
}
