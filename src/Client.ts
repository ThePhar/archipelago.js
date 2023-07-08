import { EventEmitter } from "events";
import WebSocket, { MessageEvent } from "isomorphic-ws";
import { v4 as generateUUIDv4 } from "uuid";

import { ClientStatus } from "./consts/ClientStatus.ts";
import { CLIENT_PACKET_TYPE, SERVER_PACKET_TYPE, ServerPacketType } from "./consts/CommandPacketType.ts";
import { CONNECTION_STATUS, ConnectionStatus } from "./consts/ConnectionStatus.ts";
import { PRINT_JSON_TYPE } from "./consts/PrintJSONType.ts";
import { DataManager } from "./managers/DataManager.ts";
import { HintManager } from "./managers/HintManager.ts";
import { ItemsManager } from "./managers/ItemsManager.ts";
import { LocationsManager } from "./managers/LocationsManager.ts";
import { PlayersManager } from "./managers/PlayersManager.ts";
import { ClientPacket, ServerPacket } from "./packets/BasePackets.ts";
import { BouncedPacket } from "./packets/BouncedPacket.ts";
import { ConnectedPacket } from "./packets/ConnectedPacket.ts";
import { ConnectionRefusedPacket } from "./packets/ConnectionRefusedPacket.ts";
import { DataPackagePacket } from "./packets/DataPackagePacket.ts";
import { InvalidPacketPacket } from "./packets/InvalidPacketPacket.ts";
import { LocationInfoPacket } from "./packets/LocationInfoPacket.ts";
import { PrintJSONPacket } from "./packets/PrintJSONPacket.ts";
import { ReceivedItemsPacket } from "./packets/ReceivedItemsPacket.ts";
import { RetrievedPacket } from "./packets/RetrievedPacket.ts";
import { RoomInfoPacket } from "./packets/RoomInfoPacket.ts";
import { RoomUpdatePacket } from "./packets/RoomUpdatePacket.ts";
import { SetReplyPacket } from "./packets/SetReplyPacket.ts";
import { ConnectionInformation } from "./types/ConnectionInformation.ts";
import { VALID_JSON_MESSAGE_TYPE } from "./types/JSONMessagePart.ts";
import { NetworkVersion } from "./types/NetworkVersion.ts";
import { UnknownSlotData } from "./types/UnknownSlotData.ts";

/**
 * The client that connects to an Archipelago server and facilitates communication, listens for events, and manages
 * data.
 */
export class Client<TSlotData = UnknownSlotData> {
    #socket?: WebSocket;
    #status: ConnectionStatus = CONNECTION_STATUS.DISCONNECTED;
    #emitter = new EventEmitter();
    #dataManager: DataManager<TSlotData> = new DataManager<TSlotData>(this);
    #hintManager: HintManager = new HintManager(this);
    #itemsManager: ItemsManager = new ItemsManager(this);
    #locationsManager: LocationsManager = new LocationsManager(this);
    #playersManager: PlayersManager = new PlayersManager(this);

    /**
     * Get the current WebSocket connection status to the Archipelago server.
     */
    public get status(): ConnectionStatus {
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
            this.#status = CONNECTION_STATUS.CONNECTING;

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
                    this.#status = CONNECTION_STATUS.CONNECTED;
                    this.removeListener(SERVER_PACKET_TYPE.CONNECTED, onConnectedListener);
                    resolve(packet);
                };

                const onConnectionRefusedListener = (packet: ConnectionRefusedPacket) => {
                    this.disconnect();
                    reject(packet.errors);
                };

                this.addListener(SERVER_PACKET_TYPE.CONNECTED, onConnectedListener);
                this.addListener(SERVER_PACKET_TYPE.CONNECTION_REFUSED, onConnectionRefusedListener);

                // Get the data package and connect to room.
                this.send(
                    {
                        cmd: CLIENT_PACKET_TYPE.GET_DATA_PACKAGE,
                    },
                    {
                        cmd: CLIENT_PACKET_TYPE.CONNECT,
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
     * @param packets An array of raw {@link ClientPacket}s to send to the AP server. They are processed in
     * the order they are listed as arguments.
     */
    public send(...packets: ClientPacket[]): void {
        this.#socket?.send(JSON.stringify(packets));
    }

    /**
     * Send a normal chat message to the server.
     * @param message The message to send.
     */
    public say(message: string): void {
        this.send({ cmd: CLIENT_PACKET_TYPE.SAY, text: message });
    }

    /**
     * Update the status for this client.
     * @param status The status code to send.
     */
    public updateStatus(status: ClientStatus): void {
        this.send({ cmd: CLIENT_PACKET_TYPE.STATUS_UPDATE, status });
    }

    /**
     * Disconnect from the server and re-initialize all managers.
     */
    public disconnect(): void {
        this.#socket?.close();
        this.#socket = undefined;
        this.#status = CONNECTION_STATUS.DISCONNECTED;
        this.#emitter.removeAllListeners();

        // Reinitialize our Managers.
        this.#dataManager = new DataManager(this);
        this.#hintManager = new HintManager(this);
        this.#itemsManager = new ItemsManager(this);
        this.#locationsManager = new LocationsManager(this);
        this.#playersManager = new PlayersManager(this);
    }

    public addListener(event: "Bounced", listener: (packet: BouncedPacket) => void): void;
    public addListener(event: "Connected", listener: (packet: ConnectedPacket) => void): void;
    public addListener(event: "ConnectionRefused", listener: (packet: ConnectionRefusedPacket) => void): void;
    public addListener(event: "DataPackage", listener: (packet: DataPackagePacket) => void): void;
    public addListener(event: "InvalidPacket", listener: (packet: InvalidPacketPacket) => void): void;
    public addListener(event: "LocationInfo", listener: (packet: LocationInfoPacket) => void): void;
    public addListener(event: "PrintJSON", listener: (packet: PrintJSONPacket, message: string) => void): void;
    public addListener(event: "ReceivedItems", listener: (packet: ReceivedItemsPacket) => void): void;
    public addListener(event: "Retrieved", listener: (packet: RetrievedPacket) => void): void;
    public addListener(event: "RoomInfo", listener: (packet: RoomInfoPacket) => void): void;
    public addListener(event: "RoomUpdate", listener: (packet: RoomUpdatePacket) => void): void;
    public addListener(event: "SetReply", listener: (packet: SetReplyPacket) => void): void;
    public addListener(event: "PacketReceived", listener: (packet: ServerPacket) => void): void;

    /**
     * Add an eventListener to fire depending on an event from the Archipelago server or the client.
     *
     * @param event The event to listen for.
     * @param listener The listener callback function to run when an event is fired.
     */
    public addListener(
        event: ServerPacketType | "PacketReceived",
        listener: (packet: never, message: never) => void,
    ): void {
        this.#emitter.addListener(event, listener as (packet: ServerPacket) => void);
    }

    public removeListener(event: "Bounced", listener: (packet: BouncedPacket) => void): void;
    public removeListener(event: "Connected", listener: (packet: ConnectedPacket) => void): void;
    public removeListener(event: "ConnectionRefused", listener: (packet: ConnectionRefusedPacket) => void): void;
    public removeListener(event: "DataPackage", listener: (packet: DataPackagePacket) => void): void;
    public removeListener(event: "InvalidPacket", listener: (packet: InvalidPacketPacket) => void): void;
    public removeListener(event: "LocationInfo", listener: (packet: LocationInfoPacket) => void): void;
    public removeListener(event: "PrintJSON", listener: (packet: PrintJSONPacket, message: string) => void): void;
    public removeListener(event: "ReceivedItems", listener: (packet: ReceivedItemsPacket) => void): void;
    public removeListener(event: "Retrieved", listener: (packet: RetrievedPacket) => void): void;
    public removeListener(event: "RoomInfo", listener: (packet: RoomInfoPacket) => void): void;
    public removeListener(event: "RoomUpdate", listener: (packet: RoomUpdatePacket) => void): void;
    public removeListener(event: "SetReply", listener: (packet: SetReplyPacket) => void): void;
    public removeListener(event: "PacketReceived", listener: (packet: ServerPacket) => void): void;

    /**
     * Remove an eventListener from this client's event emitter.
     *
     * @param event The event to stop listening for.
     * @param listener The listener callback function to remove.
     */
    public removeListener(
        event: ServerPacketType | "PacketReceived",
        listener: (packet: never, message: never) => void,
    ): void {
        this.#emitter.removeListener(event, listener as (packet: ServerPacket) => void);
    }

    #connectSocket(uri: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.#socket = new WebSocket(uri);

            // On successful connection.
            this.#socket.onopen = () => {
                this.#status = CONNECTION_STATUS.WAITING_FOR_AUTH;

                if (this.#socket) {
                    this.#socket.onmessage = this.#parsePackets.bind(this);
                    resolve();
                } else {
                    reject(["Socket was closed unexpectedly."]);
                }
            };

            // On unsuccessful connection.
            this.#socket.onerror = (event) => {
                this.#status = CONNECTION_STATUS.DISCONNECTED;
                reject([event]);
            };
        });
    }

    #parsePackets(event: MessageEvent): void {
        // Parse packets and fire our packetReceived event for each packet.
        const packets = JSON.parse(event.data.toString()) as ServerPacket[];
        for (const packet of packets) {
            // Regardless of what type of event this is, we always emit the packetReceived event.
            this.#emitter.emit("packetReceived", packet);

            switch (packet.cmd) {
                case SERVER_PACKET_TYPE.INVALID_PACKET:
                    this.#emitter.emit("invalidPacket", packet);
                    break;
                case SERVER_PACKET_TYPE.BOUNCED:
                    this.#emitter.emit("bounced", packet);
                    break;
                case SERVER_PACKET_TYPE.CONNECTION_REFUSED:
                    this.#emitter.emit("connectionRefused", packet);
                    break;
                case SERVER_PACKET_TYPE.CONNECTED:
                    this.#emitter.emit("connected", packet);
                    break;
                case SERVER_PACKET_TYPE.DATA_PACKAGE:
                    this.#emitter.emit("dataPackage", packet);
                    break;
                case SERVER_PACKET_TYPE.LOCATION_INFO:
                    this.#emitter.emit("locationInfo", packet);
                    break;
                case SERVER_PACKET_TYPE.RECEIVED_ITEMS:
                    this.#emitter.emit("receivedItems", packet);
                    break;
                case SERVER_PACKET_TYPE.RETRIEVED:
                    this.#emitter.emit("retrieved", packet);
                    break;
                case SERVER_PACKET_TYPE.ROOM_INFO:
                    this.#emitter.emit("roomInfo", packet);
                    break;
                case SERVER_PACKET_TYPE.ROOM_UPDATE:
                    this.#emitter.emit("roomUpdate", packet);
                    break;
                case SERVER_PACKET_TYPE.SET_REPLY:
                    this.#emitter.emit("setReply", packet);
                    break;
                case SERVER_PACKET_TYPE.PRINT_JSON: {
                    // Add the plain text version of entire message for easy access.
                    this.#emitter.emit("printJSON", packet, this.#consolidateMessage(packet));
                    break;
                }
            }
        }
    }

    #consolidateMessage(packet: PrintJSONPacket): string {
        // If we're lucky, we can take a shortcut.
        if (packet.type === PRINT_JSON_TYPE.CHAT || packet.type === PRINT_JSON_TYPE.SERVER_CHAT) {
            return packet.message;
        }

        // I guess not, let's reduce through and create message, replacing text as needed if we run into any ids.
        return packet.data.reduce((string, piece) => {
            switch (piece.type) {
                case VALID_JSON_MESSAGE_TYPE.PLAYER_ID:
                    return string + this.players.alias(parseInt(piece.text));

                case VALID_JSON_MESSAGE_TYPE.LOCATION_ID:
                    return string + this.locations.name(this.players.game(piece.player), parseInt(piece.text));

                case VALID_JSON_MESSAGE_TYPE.ITEM_ID:
                    return string + this.items.name(this.players.game(piece.player), parseInt(piece.text));

                default:
                    return string + piece.text;
            }
        }, "");
    }
}

/** Minimum supported version of Archipelago this library supports. */
export const MINIMUM_SUPPORTED_AP_VERSION: Omit<NetworkVersion, "class"> = {
    major: 0,
    minor: 4,
    build: 2,
};
