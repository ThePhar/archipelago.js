import { EventEmitter } from "events";
import WebSocket, { MessageEvent } from "isomorphic-ws";

import * as Packet from "./packets";
import { CommandPacketType, SessionStatus } from "./enums";
import { DataManager, ItemsManager, LocationsManager, PlayersManager } from "./managers";
import { SlotCredentials } from "./structs";

/**
 * The client that connects to an Archipelago server and facilitates communication, listens for events, and manages
 * data.
 */
export class ArchipelagoClient {
    private readonly _uri: string;
    private _socket?: WebSocket;
    private _status = SessionStatus.DISCONNECTED;
    private _emitter = new EventEmitter();
    private _dataManager = new DataManager(this);
    private _itemsManager = new ItemsManager(this);
    private _locationsManager = new LocationsManager(this);
    private _playersManager = new PlayersManager(this);

    /**
     * Creates a new client that is programmed to connect to a specific Archipelago server address.
     *
     * @param socketAddress The socket address to connect to. Examples: `127.0.0.1:50000` or `archipelago.gg:38281`.
     */
    public constructor(socketAddress: string) {
        this._uri = `ws://${socketAddress}/`;
    }

    /**
     * Get the current WebSocket connection status to the Archipelago server.
     */
    public get status(): SessionStatus {
        return this._status;
    }

    /**
     * Get the {@link DataManager} helper object. See {@link DataManager} for additional information.
     */
    public get data(): DataManager {
        return this._dataManager;
    }

    /**
     * Get the {@link ItemsManager} helper object. See {@link ItemsManager} for additional information.
     */
    public get items(): ItemsManager {
        return this._itemsManager;
    }

    /**
     * Get the {@link LocationsManager} helper object. See {@link LocationsManager} for additional information.
     */
    public get locations(): LocationsManager {
        return this._locationsManager;
    }

    /**
     * Get the {@link PlayersManager} helper object. See {@link PlayersManager} for additional information.
     */
    public get players(): PlayersManager {
        return this._playersManager;
    }

    /**
     * Connects to the given address with given connection information.
     *
     * @param credentials An object with all the credential information to connect to the slot.
     * @resolves On successful connection and authentication to the room.
     * @rejects If web socket connection failed to establish connection or server refused connection, promise will
     * return a `string[]` of error messages.
     */
    public async connect(credentials: SlotCredentials): Promise<void> {
        // First establish the initial connection.
        this._status = SessionStatus.CONNECTING;
        await new Promise<void>((resolve, reject) => {
            this._socket = new WebSocket(this._uri);

            // On successful connection.
            this._socket.onopen = () => {
                this._status = SessionStatus.WAITING_FOR_AUTH;

                if (this._socket) {
                    this._socket.onmessage = this.parsePackets.bind(this);
                    resolve();
                } else {
                    reject(["Socket was closed unexpectedly."]);
                }
            };

            // On unsuccessful connection.
            this._socket.onerror = (event) => {
                this._status = SessionStatus.DISCONNECTED;
                reject([event.message]);
            };
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
                {
                    cmd: CommandPacketType.GET_DATA_PACKAGE,
                },
                {
                    cmd: CommandPacketType.CONNECT,
                    game: credentials.game,
                    uuid: credentials.uuid,
                    name: credentials.name,
                    password: credentials.password ?? "",
                    version: { ...credentials.version, class: "Version" },
                    tags: credentials.tags ?? [],
                    items_handling: credentials.items_handling,
                },
            );
        });
    }

    /**
     * Send a list of raw packets to the Archipelago server in the order they are listed as arguments.
     *
     * @param packets An array of raw {@link ArchipelagoClientPacket}s to send to the AP server. They are processed in
     * the order they are listed as arguments.
     */
    public send(...packets: Packet.ArchipelagoClientPacket[]): void {
        this._socket?.send(JSON.stringify(packets));
    }

    /**
     * Disconnect from the server and re-initialize all managers.
     */
    public disconnect(): void {
        this._socket?.close();
        this._socket = undefined;
        this._status = SessionStatus.DISCONNECTED;
        this._emitter.removeAllListeners();

        // Reinitialize our Managers.
        this._dataManager = new DataManager(this);
        this._itemsManager = new ItemsManager(this);
        this._locationsManager = new LocationsManager(this);
        this._playersManager = new PlayersManager(this);
    }

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

    /**
     * Add an eventListener to fire depending on an event from the Archipelago server or the client.
     *
     * @param event The event to listen for.
     * @param listener The listener callback function to run when an event is fired.
     */
    public addListener(event: ClientEvents, listener: (packet: never) => void): void {
        this._emitter.addListener(event, listener as (packet: Packet.ArchipelagoServerPacket) => void);
    }

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

    /**
     * Remove an eventListener from this client's event emitter.
     *
     * @param event The event to stop listening for.
     * @param listener The listener callback function to remove.
     */
    public removeListener(event: ClientEvents, listener: (packet: never) => void): void {
        this._emitter.removeListener(event, listener as (packet: Packet.ArchipelagoServerPacket) => void);
    }

    private parsePackets(event: MessageEvent): void {
        // Parse packets and fire our packetReceived event for each packet.
        const packets = JSON.parse(event.data.toString()) as Packet.ArchipelagoServerPacket[];
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

/**
 * A type union of events the {@link ArchipelagoClient} can allow subscriptions for.
 */
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
