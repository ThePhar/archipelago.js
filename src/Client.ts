import WebSocket, { MessageEvent } from "isomorphic-ws";
import { EventEmitter } from "events";
import { v4 as generateUUIDv4 } from "uuid";
import { AbstractSlotData } from "./AbstractSlotData.ts";
import { ClientStatus } from "./ClientStatus.ts";
import { DataManager } from "./DataManager.ts";
import { SessionStatus } from "./SessionStatus.ts";
import { HintManager } from "./HintManager.ts";
import { ItemsManager } from "./ItemsManager.ts";
import { LocationsManager } from "./LocationsManager.ts";
import { PlayersManager } from "./PlayersManager.ts";
import { ConnectionInformation } from "./ConnectionInformation.ts";
import { ConnectedPacket } from "./ConnectedPacket.ts";
import { ClientPacketType, ServerPacketType } from "./CommandPacketType.ts";
import { ConnectionRefusedPacket } from "./ConnectionRefusedPacket.ts";
import { ArchipelagoClientPacket, ArchipelagoServerPacket } from "./BasePacket.ts";
import { SetReplyPacket } from "./SetReplyPacket.ts";
import { RoomUpdatePacket } from "./RoomUpdatePacket.ts";
import { RoomInfoPacket } from "./RoomInfoPacket.ts";
import { RetrievedPacket } from "./RetrievedPacket.ts";
import { ReceivedItemsPacket } from "./ReceivedItemsPacket.ts";
import { BouncedPacket } from "./BouncedPacket.ts";
import { PrintJSONPacket } from "./PrintJSONPacket.ts";
import { LocationInfoPacket } from "./LocationInfoPacket.ts";
import { InvalidPacketPacket } from "./InvalidPacketPacket.ts";
import { DataPackagePacket } from "./DataPackagePacket.ts";
import { PrintJSONType } from "./PrintJSONType.ts";

/**
 * The client that connects to an Archipelago server and facilitates communication, listens for events, and manages
 * data.
 */
export class Client<TSlotData = AbstractSlotData> {
    #socket?: WebSocket;
    #status = SessionStatus.DISCONNECTED;
    #emitter = new EventEmitter();
    #dataManager: DataManager<TSlotData> = new DataManager<TSlotData>(this);
    #hintManager: HintManager = new HintManager(this);
    #itemsManager: ItemsManager = new ItemsManager(this);
    #locationsManager: LocationsManager = new LocationsManager(this);
    #playersManager: PlayersManager = new PlayersManager(this);

    /**
     * Get the current WebSocket connection status to the Archipelago server.
     */
    public get status(): SessionStatus {
        return this.#status;
    }

    /**
     * Get the {@link DataManager} helper object. See {@link DataManager} for additional information.
     */
    public get data(): DataManager<TSlotData> {
        return this.#dataManager;
    }

    /**
     * Get the {@link HintManager} helper object. See {@link HintManager} for additional information.
     */
    public get hints(): HintManager {
        return this.#hintManager;
    }

    /**
     * Get the {@link ItemsManager} helper object. See {@link ItemsManager} for additional information.
     */
    public get items(): ItemsManager {
        return this.#itemsManager;
    }

    /**
     * Get the {@link LocationsManager} helper object. See {@link LocationsManager} for additional information.
     */
    public get locations(): LocationsManager {
        return this.#locationsManager;
    }

    /**
     * Get the {@link PlayersManager} helper object. See {@link PlayersManager} for additional information.
     */
    public get players(): PlayersManager {
        return this.#playersManager;
    }

    /**
     * Get the URI of the current connection, including protocol.
     */
    public get uri(): string | undefined {
        if (this.#socket) {
            return this.#socket.url;
        }

        return;
    }

    /**
     * Connects to the given address with given connection information.
     *
     * @param info All the necessary connection information to connect to an Archipelago server.
     *
     * @resolves On successful connection and authentication to the room.
     * @rejects If web socket connection failed to establish connection or server refused connection, promise will
     * return a `string[]` of error messages.
     */
    public async connect(info: ConnectionInformation): Promise<ConnectedPacket> {
        const { hostname, port, game, name, uuid, password, protocol, items_handling, tags } = info;
        const version = info.version ?? MINIMUM_SUPPORTED_AP_VERSION;

        // Confirm a valid port was given.
        if (port < 1 || port > 65535 || !Number.isInteger(port))
            throw new Error(`Port must be an integer between 1 and 65535. Received: ${port}`);

        try {
            // First establish the initial connection.
            this.#status = SessionStatus.CONNECTING;

            if (protocol === "ws") {
                await this.#connectSocket(`ws://${hostname}:${port}/`);
            } else if (protocol === "wss") {
                await this.#connectSocket(`wss://${hostname}:${port}/`);
            } else {
                try {
                    // Attempt a secure connection first.
                    await this.#connectSocket(`wss://${hostname}:${port}/`);
                } catch {
                    // Failing that, attempt to connect to normal websocket.
                    await this.#connectSocket(`ws://${hostname}:${port}/`);
                }
            }

            // Attempt to log into the room.
            return await new Promise<ConnectedPacket>((resolve, reject) => {
                // Successfully connected!
                const onConnectedListener = (packet: ConnectedPacket) => {
                    this.#status = SessionStatus.CONNECTED;
                    this.removeListener(ServerPacketType.CONNECTED, onConnectedListener);
                    resolve(packet);
                };

                const onConnectionRefusedListener = (packet: ConnectionRefusedPacket) => {
                    this.disconnect();
                    reject(packet.errors);
                };

                this.addListener(ServerPacketType.CONNECTED, onConnectedListener);
                this.addListener(ServerPacketType.CONNECTION_REFUSED, onConnectionRefusedListener);

                // Get the data package and connect to room.
                this.send(
                    {
                        cmd: ClientPacketType.GET_DATA_PACKAGE,
                    },
                    {
                        cmd: ClientPacketType.CONNECT,
                        game,
                        name,
                        version: { ...version, class: "Version" },
                        items_handling,
                        uuid: uuid ?? generateUUIDv4(),
                        tags: tags ?? [],
                        password: password ?? "",
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
    public send(...packets: ArchipelagoClientPacket[]): void {
        this.#socket?.send(JSON.stringify(packets));
    }

    /**
     * Send a normal chat message to the server.
     * @param message The message to send.
     */
    public say(message: string): void {
        this.send({ cmd: ClientPacketType.SAY, text: message });
    }

    /**
     * Update the status for this client.
     * @param status The status code to send.
     */
    public updateStatus(status: ClientStatus): void {
        this.send({ cmd: ClientPacketType.STATUS_UPDATE, status });
    }

    /**
     * Disconnect from the server and re-initialize all managers.
     */
    public disconnect(): void {
        this.#socket?.close();
        this.#socket = undefined;
        this.#status = SessionStatus.DISCONNECTED;
        this.#emitter.removeAllListeners();

        // Reinitialize our Managers.
        this.#dataManager = new DataManager(this);
        this.#hintManager = new HintManager(this);
        this.#itemsManager = new ItemsManager(this);
        this.#locationsManager = new LocationsManager(this);
        this.#playersManager = new PlayersManager(this);
    }

    public addListener(event: ServerPacketType.BOUNCED, listener:
        (packet: BouncedPacket) => void): void;
    public addListener(event: ServerPacketType.CONNECTED, listener:
        (packet: ConnectedPacket) => void): void;
    public addListener(event: ServerPacketType.CONNECTION_REFUSED, listener:
        (packet: ConnectionRefusedPacket) => void): void;
    public addListener(event: ServerPacketType.DATA_PACKAGE, listener:
        (packet: DataPackagePacket) => void): void;
    public addListener(event: ServerPacketType.INVALID_PACKET, listener:
        (packet: InvalidPacketPacket) => void): void;
    public addListener(event: ServerPacketType.LOCATION_INFO, listener:
        (packet: LocationInfoPacket) => void): void;
    public addListener(event: ServerPacketType.PRINT_JSON, listener:
        (packet: PrintJSONPacket, message: string) => void): void;
    public addListener(event: ServerPacketType.RECEIVED_ITEMS, listener:
        (packet: ReceivedItemsPacket) => void): void;
    public addListener(event: ServerPacketType.RETRIEVED, listener:
        (packet: RetrievedPacket) => void): void;
    public addListener(event: ServerPacketType.ROOM_INFO, listener:
        (packet: RoomInfoPacket) => void): void;
    public addListener(event: ServerPacketType.ROOM_UPDATE, listener:
        (packet: RoomUpdatePacket) => void): void;
    public addListener(event: ServerPacketType.SET_REPLY, listener:
        (packet: SetReplyPacket) => void): void;
    public addListener(event: "AnyPacket", listener:
        (packet: ArchipelagoServerPacket) => void): void;

    /**
     * Add an eventListener to fire depending on an event from the Archipelago server or the client.
     *
     * @param event The event to listen for.
     * @param listener The listener callback function to run when an event is fired.
     */
    public addListener(event: ServerPacketType | "AnyPacket", listener:
        (packet: never, message: never) => void): void {
        this.#emitter.addListener(event, listener as (packet: ArchipelagoServerPacket) => void);
    }

    public removeListener(event: ServerPacketType.BOUNCED, listener:
        (packet: BouncedPacket) => void): void;
    public removeListener(event: ServerPacketType.CONNECTED, listener:
        (packet: ConnectedPacket) => void): void;
    public removeListener(event: ServerPacketType.CONNECTION_REFUSED, listener:
        (packet: ConnectionRefusedPacket) => void): void;
    public removeListener(event: ServerPacketType.DATA_PACKAGE, listener:
        (packet: DataPackagePacket) => void): void;
    public removeListener(event: ServerPacketType.INVALID_PACKET, listener:
        (packet: InvalidPacketPacket) => void): void;
    public removeListener(event: ServerPacketType.LOCATION_INFO, listener:
        (packet: LocationInfoPacket) => void): void;
    public removeListener(event: ServerPacketType.PRINT_JSON, listener:
        (packet: PrintJSONPacket, message: string) => void): void;
    public removeListener(event: ServerPacketType.RECEIVED_ITEMS, listener:
        (packet: ReceivedItemsPacket) => void): void;
    public removeListener(event: ServerPacketType.RETRIEVED, listener:
        (packet: RetrievedPacket) => void): void;
    public removeListener(event: ServerPacketType.ROOM_INFO, listener:
        (packet: RoomInfoPacket) => void): void;
    public removeListener(event: ServerPacketType.ROOM_UPDATE, listener:
        (packet: RoomUpdatePacket) => void): void;
    public removeListener(event: ServerPacketType.SET_REPLY, listener:
        (packet: SetReplyPacket) => void): void;
    public removeListener(event: "AnyPacket", listener:
        (packet: ArchipelagoServerPacket) => void): void;

    /**
     * Remove an eventListener from this client's event emitter.
     *
     * @param event The event to stop listening for.
     * @param listener The listener callback function to remove.
     */
    public removeListener(event: ServerPacketType | "AnyPacket", listener:
        (packet: never, message: never) => void): void {
        this.#emitter.removeListener(event, listener as (packet: ArchipelagoServerPacket) => void);
    }

    #connectSocket(uri: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.#socket = new WebSocket(uri);

            // On successful connection.
            this.#socket.onopen = () => {
                this.#status = SessionStatus.WAITING_FOR_AUTH;

                if (this.#socket) {
                    this.#socket.onmessage = this.#parsePackets.bind(this);
                    resolve();
                } else {
                    reject(["Socket was closed unexpectedly."]);
                }
            };

            // On unsuccessful connection.
            this.#socket.onerror = (event) => {
                this.#status = SessionStatus.DISCONNECTED;
                reject([event]);
            };
        });
    }

    #parsePackets(event: MessageEvent): void {
        // Parse packets and fire our packetReceived event for each packet.
        const packets = JSON.parse(event.data.toString()) as ArchipelagoServerPacket[];
        for (const packet of packets) {
            // Regardless of what type of event this is, we always emit the packetReceived event.
            this.#emitter.emit("packetReceived", packet);

            switch (packet.cmd) {
                case ServerPacketType.INVALID_PACKET:
                    this.#emitter.emit("invalidPacket", packet);
                    break;
                case ServerPacketType.BOUNCED:
                    this.#emitter.emit("bounced", packet);
                    break;
                case ServerPacketType.CONNECTION_REFUSED:
                    this.#emitter.emit("connectionRefused", packet);
                    break;
                case ServerPacketType.CONNECTED:
                    this.#emitter.emit("connected", packet);
                    break;
                case ServerPacketType.DATA_PACKAGE:
                    this.#emitter.emit("dataPackage", packet);
                    break;
                case ServerPacketType.LOCATION_INFO:
                    this.#emitter.emit("locationInfo", packet);
                    break;
                case ServerPacketType.RECEIVED_ITEMS:
                    this.#emitter.emit("receivedItems", packet);
                    break;
                case ServerPacketType.RETRIEVED:
                    this.#emitter.emit("retrieved", packet);
                    break;
                case ServerPacketType.ROOM_INFO:
                    this.#emitter.emit("roomInfo", packet);
                    break;
                case ServerPacketType.ROOM_UPDATE:
                    this.#emitter.emit("roomUpdate", packet);
                    break;
                case ServerPacketType.SET_REPLY:
                    this.#emitter.emit("setReply", packet);
                    break;
                case ServerPacketType.PRINT_JSON: {
                    // Add the plain text for easy access.
                    let message = "";
                    if (packet.type === PrintJSONType.CHAT || packet.type === PrintJSONType.SERVER_CHAT) {
                        message = packet.message;
                    } else {
                        // Join each data piece together.
                        for (const data of packet.data) {
                            if (data.text) message += data.text;
                        }
                    }

                    this.#emitter.emit("printJSON", packet, message);
                    break;
                }
            }
        }
    }
}

/** Minimum supported version of Archipelago this library supports. */
export const MINIMUM_SUPPORTED_AP_VERSION = {
    major: 0,
    minor: 4,
    build: 2,
};
