import { EventEmitter } from "events";
import WebSocket, { MessageEvent } from "isomorphic-ws";
import { v4 as generateUUIDv4 } from "uuid";

import * as Packet from "./packets";
import { ClientStatus, CommandPacketType, SessionStatus } from "./enums";
import { DataManager, ItemsManager, LocationsManager, PlayersManager } from "./managers";
import { SlotCredentials } from "./structs";

/**
 * The client that connects to an Archipelago server and facilitates communication, listens for events, and manages
 * data.
 */
export class ArchipelagoClient<TSlotData = BaseSlotData> {
    private _socket?: WebSocket;
    private _status = SessionStatus.DISCONNECTED;
    private _emitter = new EventEmitter();
    private _dataManager: DataManager<TSlotData> = new DataManager<TSlotData>(this);
    private _itemsManager: ItemsManager<TSlotData> = new ItemsManager(this);
    private _locationsManager: LocationsManager<TSlotData> = new LocationsManager(this);
    private _playersManager: PlayersManager<TSlotData> = new PlayersManager(this);

    /**
     * Get the current WebSocket connection status to the Archipelago server.
     */
    public get status(): SessionStatus {
        return this._status;
    }

    /**
     * Get the {@link DataManager} helper object. See {@link DataManager} for additional information.
     */
    public get data(): DataManager<TSlotData> {
        return this._dataManager;
    }

    /**
     * Get the {@link ItemsManager} helper object. See {@link ItemsManager} for additional information.
     */
    public get items(): ItemsManager<TSlotData> {
        return this._itemsManager;
    }

    /**
     * Get the {@link LocationsManager} helper object. See {@link LocationsManager} for additional information.
     */
    public get locations(): LocationsManager<TSlotData> {
        return this._locationsManager;
    }

    /**
     * Get the {@link PlayersManager} helper object. See {@link PlayersManager} for additional information.
     */
    public get players(): PlayersManager<TSlotData> {
        return this._playersManager;
    }

    /**
     * Get the URI of the current connection, including protocol.
     */
    public get uri(): string | undefined {
        if (this._socket)
            return this._socket.url;

        return;
    }

    /**
     * Connects to the given address with given connection information.
     *
     * @param hostname The IP address or domain of the server you are attempting to connect to.
     * @param port The port of the server you are attempting to connect to.
     * @param credentials An object with all the credential information to connect to the slot.
     * @param explicitProtocol If not `null`, will attempt a specific protocol and prevent fallback to another protocol
     * if connection fails to establish.
     *
     * @resolves On successful connection and authentication to the room.
     * @rejects If web socket connection failed to establish connection or server refused connection, promise will
     * return a `string[]` of error messages.
     */
    public async connect(
        credentials: SlotCredentials,
        hostname: string,
        port = 38281,
        explicitProtocol: "ws" | "wss" | null = null): Promise<void>
    {
        // Confirm a valid port was given.
        if (port < 1 || port > 65535 || !Number.isInteger(port))
            throw new Error(`Port must be an integer between 1 and 65535. Received: ${port}`);

        try {
            // First establish the initial connection.
            this._status = SessionStatus.CONNECTING;

            if (explicitProtocol === "ws") {
                await this.connectSocket(`ws://${hostname}:${port}/`);
            } else if (explicitProtocol === "wss") {
                await this.connectSocket(`wss://${hostname}:${port}/`);
            } else {
                try {
                    // Attempt a secure connection first.
                    await this.connectSocket(`wss://${hostname}:${port}/`);
                } catch {
                    // Failing that, attempt to connect to normal websocket.
                    await this.connectSocket(`ws://${hostname}:${port}/`);
                }
            }

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
                        name: credentials.name,
                        version: { ...credentials.version, class: "Version" },
                        items_handling: credentials.items_handling,
                        uuid: credentials.uuid ?? generateUUIDv4(),
                        tags: credentials.tags ?? [],
                        password: credentials.password ?? "",
                    },
                );
            });
        } catch (error) {
            this.disconnect();
            throw error;
        }
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
     * Send a normal chat message to the server.
     * @param message The message to send.
     */
    public say(message: string): void {
        this.send({ cmd: CommandPacketType.SAY, text: message });
    }

    /**
     * Update the status for this client.
     * @param status The status code to send.
     */
    public updateStatus(status: ClientStatus): void {
        this.send({ cmd: CommandPacketType.STATUS_UPDATE, status });
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
    public addListener(event: "printJSON", listener: (packet: Packet.PrintJSONPacket, message: string) => void): void;
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
    public addListener(event: ClientEvents, listener: (packet: never, message: never) => void): void {
        this._emitter.addListener(event, listener as (packet: Packet.ArchipelagoServerPacket) => void);
    }

    public removeListener(event: "bounced", listener: (packet: Packet.BouncedPacket) => void): void;
    public removeListener(event: "connected", listener: (packet: Packet.ConnectedPacket) => void): void;
    public removeListener(event: "connectionRefused", listener: (packet: Packet.ConnectionRefusedPacket) => void): void;
    public removeListener(event: "dataPackage", listener: (packet: Packet.DataPackagePacket) => void): void;
    public removeListener(event: "invalidPacket", listener: (packet: Packet.InvalidPacketPacket) => void): void;
    public removeListener(event: "locationInfo", listener: (packet: Packet.LocationInfoPacket) => void): void;
    public removeListener(event: "printJSON", listener: (packet: Packet.PrintJSONPacket, message: string) => void):void;
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
    public removeListener(event: ClientEvents, listener: (packet: never, message: never) => void): void {
        this._emitter.removeListener(event, listener as (packet: Packet.ArchipelagoServerPacket) => void);
    }

    private connectSocket(uri: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this._socket = new WebSocket(uri);

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
                reject([event]);
            };
        });
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
                case CommandPacketType.PRINT_JSON: {
                    // Add the plain text for easy access.
                    let message = "";
                    if (packet.message) {
                        message = packet.message;
                    } else {
                        // Join each data piece together.
                        for (const data of packet.data) {
                            if (data.text) message += data.text;
                        }
                    }

                    this._emitter.emit("printJSON", packet, message);
                    break;
                }
            }
        }
    }
}

export interface BaseSlotData {
    [arg: string]: unknown;
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
    | "receivedItems"
    | "retrieved"
    | "roomInfo"
    | "roomUpdate"
    | "setReply";
