import EventEmitter from "events";
import { randomUUID } from "crypto";
import { client as WebSocket, connection as Connection, Message } from "websocket";

import * as Packet from "@packets";
import { CommandPacketType, ItemsHandlingFlags, SessionStatus } from "@enums";
import { DataManager, ItemsManager, LocationsManager, NetworkVersion } from "@structs";

export class ArchipelagoClient {
    private readonly _uri: string;
    private readonly _version: NetworkVersion;
    private _socket = new WebSocket();
    private _connection?: Connection;
    private _status = SessionStatus.DISCONNECTED;
    private _emitter = new EventEmitter();

    private _dataManager = new DataManager(this);
    private _locationsManager = new LocationsManager(this);
    private _itemsManager = new ItemsManager(this);

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
     * Get the Data Manager helper object.
     */
    public get data(): DataManager {
        return this._dataManager;
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
    public async connect(
        game: string,
        name: string,
        password = "",
        tags: string[] = [],
        itemsHandling: number = ItemsHandlingFlags.NON_REMOTE,
    ): Promise<void> {
        // First establish the initial connection.
        this._status = SessionStatus.CONNECTING;
        this._connection = await new Promise<Connection>((resolve, reject) => {
            // On successful connection.
            this._socket.on("connect", (connection) => {
                this._status = SessionStatus.WAITING_FOR_AUTH;
                connection.on("message", this.parsePackets.bind(this));

                // Basic event listeners for Connection events from AP server.
                resolve(connection);
            });

            // On unsuccessful connection.
            this._socket.on("connectFailed", (error) => {
                this._status = SessionStatus.DISCONNECTED;
                reject([error.message]);
            });

            // Connect.
            this._socket.connect(this._uri);
        });

        // Attempt to log into the room.
        await new Promise<void>((resolve, reject) => {
            const onConnectedListener = () => {
                this._status = SessionStatus.CONNECTED;
                this.removeListener("connected", onConnectedListener);
                resolve();
            };

            const onConnectionRefusedListener = (packet: Packet.ConnectionRefusedPacket) => {
                this.disconnect();
                reject(packet.errors);
            };

            this.addListener("connected", onConnectedListener);
            this.addListener("connectionRefused", onConnectionRefusedListener);

            // Get the data package and connect to room.
            this.send(
                { cmd: CommandPacketType.GET_DATA_PACKAGE },
                {
                    cmd: CommandPacketType.CONNECT,
                    uuid: randomUUID(),
                    game,
                    name,
                    password,
                    tags,
                    items_handling: itemsHandling,
                    version: this._version,
                },
            );
        });
    }

    /**
     * Send a list of packets to the Archipelago server in the order they are defined.
     * @param packets A list of packets to send to the AP server. They are processed in the order they are defined in
     * this list.
     */
    public send(...packets: Packet.ArchipelagoClientPacket[]): void {
        this._connection?.send(JSON.stringify(packets));
    }

    /**
     * Disconnect from the server and re-initialize any managers.
     */
    public disconnect(): void {
        this._connection?.close(0, "Disconnecting");
        this._connection = undefined;
        this._status = SessionStatus.DISCONNECTED;
        this._emitter.removeAllListeners();

        // Reinitialize our Managers.
        this._dataManager = new DataManager(this);
    }

    /**
     * Add an eventListener to fire depending on an event from the Archipelago server.
     * @param event The packet event to listen for.
     * @param listener The listener callback function to run when a packet is received.
     */
    public addListener(event: "bounced", listener: (packet: Packet.BouncedPacket) => void): void;
    public addListener(event: "connected", listener: (packet: Packet.ConnectedPacket) => void): void;
    public addListener(event: "connectionRefused", listener: (packet: Packet.ConnectionRefusedPacket) => void): void;
    public addListener(event: "dataPackage", listener: (packet: Packet.DataPackagePacket) => void): void;
    public addListener(event: "invalidPacket", listener: (packet: Packet.InvalidPacketPacket) => void): void;
    public addListener(event: "locationInfo", listener: (packet: Packet.LocationInfoPacket) => void): void;
    public addListener(event: "printJSON", listener: (packet: Packet.PrintJSONPacket) => void): void;
    public addListener(event: "print", listener: (packet: Packet.PrintPacket) => void): void;
    public addListener(event: "receivedItems", listener: (packet: Packet.ReceivedItemsPacket) => void): void;
    public addListener(event: "retrieved", listener: (packet: Packet.RetrievedPacket) => void): void;
    public addListener(event: "roomInfo", listener: (packet: Packet.RoomInfoPacket) => void): void;
    public addListener(event: "roomUpdate", listener: (packet: Packet.RoomUpdatePacket) => void): void;
    public addListener(event: "setReply", listener: (packet: Packet.SetReplyPacket) => void): void;
    public addListener(event: "packetReceived", listener: (packet: Packet.ArchipelagoServerPacket) => void): void;
    public addListener(event: ClientEvents, listener: (packet: never) => void): void {
        this._emitter.addListener(event, listener as (packet: Packet.ArchipelagoServerPacket) => void);
    }

    /**
     * Remove an eventListener from this client's event emitter.
     * @param event The packet event to stop listening for.
     * @param listener The listener callback function to remove.
     */
    public removeListener(event: "bounced", listener: (packet: Packet.BouncedPacket) => void): void;
    public removeListener(event: "connected", listener: (packet: Packet.ConnectedPacket) => void): void;
    public removeListener(event: "connectionRefused", listener: (packet: Packet.ConnectionRefusedPacket) => void): void;
    public removeListener(event: "dataPackage", listener: (packet: Packet.DataPackagePacket) => void): void;
    public removeListener(event: "invalidPacket", listener: (packet: Packet.InvalidPacketPacket) => void): void;
    public removeListener(event: "locationInfo", listener: (packet: Packet.LocationInfoPacket) => void): void;
    public removeListener(event: "printJSON", listener: (packet: Packet.PrintJSONPacket) => void): void;
    public removeListener(event: "print", listener: (packet: Packet.PrintPacket) => void): void;
    public removeListener(event: "receivedItems", listener: (packet: Packet.ReceivedItemsPacket) => void): void;
    public removeListener(event: "retrieved", listener: (packet: Packet.RetrievedPacket) => void): void;
    public removeListener(event: "roomInfo", listener: (packet: Packet.RoomInfoPacket) => void): void;
    public removeListener(event: "roomUpdate", listener: (packet: Packet.RoomUpdatePacket) => void): void;
    public removeListener(event: "setReply", listener: (packet: Packet.SetReplyPacket) => void): void;
    public removeListener(event: "packetReceived", listener: (packet: Packet.ArchipelagoServerPacket) => void): void;
    public removeListener(event: ClientEvents, listener: (packet: never) => void): void {
        this._emitter.removeListener(event, listener as (packet: Packet.ArchipelagoServerPacket) => void);
    }

    private parsePackets(buffer: Message): void {
        // Ignore binary data from the server. It shouldn't happen, but you never know.
        if (buffer.type !== "utf8") return;

        // Parse packets and fire our packetReceived event for each packet.
        const packets = JSON.parse(buffer.utf8Data) as Packet.ArchipelagoServerPacket[];
        for (const packet of packets) {
            // Regardless of what type of event this is, we always emit the packetReceived event.
            this._emitter.emit("packetReceived", packet);

            switch (packet.cmd) {
                case CommandPacketType.INVALID_PACKET:
                    this._emitter.emit("invalidPacket", packet);
                    break;
                case CommandPacketType.BOUNCED:
                    this._emitter.emit("bounced", packet);
                    break;
                case CommandPacketType.CONNECTION_REFUSED:
                    this._emitter.emit("connectionRefused", packet);
                    break;
                case CommandPacketType.CONNECTED:
                    this._emitter.emit("connected", packet);
                    break;
                case CommandPacketType.DATA_PACKAGE:
                    this._emitter.emit("dataPackage", packet);
                    break;
                case CommandPacketType.LOCATION_INFO:
                    this._emitter.emit("locationInfo", packet);
                    break;
                case CommandPacketType.PRINT_JSON:
                    this._emitter.emit("printJSON", packet);
                    break;
                case CommandPacketType.PRINT:
                    this._emitter.emit("print", packet);
                    break;
                case CommandPacketType.RECEIVED_ITEMS:
                    this._emitter.emit("receivedItems", packet);
                    break;
                case CommandPacketType.RETRIEVED:
                    this._emitter.emit("retrieved", packet);
                    break;
                case CommandPacketType.ROOM_INFO:
                    this._emitter.emit("roomInfo", packet);
                    break;
                case CommandPacketType.ROOM_UPDATE:
                    this._emitter.emit("roomUpdate", packet);
                    break;
                case CommandPacketType.SET_REPLY:
                    this._emitter.emit("setReply", packet);
                    break;
            }
        }
    }
}

export type ClientEvents =
    | "packetReceived"
    | "bounced"
    | "connected"
    | "connectionRefused"
    | "dataPackage"
    | "invalidPacket"
    | "locationInfo"
    | "printJSON"
    | "print"
    | "receivedItems"
    | "retrieved"
    | "roomInfo"
    | "roomUpdate"
    | "setReply";
