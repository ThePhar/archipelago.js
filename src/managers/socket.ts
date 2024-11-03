import {
    BouncedPacket,
    ClientPacket,
    ConnectedPacket,
    ConnectionRefusedPacket,
    DataPackagePacket,
    InvalidPacketPacket, JSONSerializableData,
    LocationInfoPacket,
    PrintJSONPacket,
    ReceivedItemsPacket,
    RetrievedPacket,
    RoomInfoPacket,
    RoomUpdatePacket,
    ServerPacket,
    SetReplyPacket,
} from "../api";
import { Client } from "../client.ts";
import { EventBasedManager } from "./abstract.ts";

/**
 * Manages socket-level communication and exposes helper methods/events for interacting with the Archipelago API
 * directly.
 */
export class SocketManager extends EventBasedManager<SocketEvents> {
    #client: Client;
    #socket: WebSocket | null = null;
    #connected: boolean = false;

    /** Returns `true` if currently connected to a websocket server. */
    public get connected(): boolean {
        return this.#connected;
    }

    /** Returns the current connection's URL or an empty string, if not connected. */
    public get url(): string {
        return this.#socket?.url ?? "";
    }

    /**
     * Instantiates a new SocketManager. Should only be instantiated by creating a new {@link Client}.
     * @internal
     * @param client The client object this manager is associated with.
     */
    public constructor(client: Client) {
        super();
        this.#client = client;
    }

    /**
     * Send a list of raw client packets to the server.
     * @param packets List of client packets to send.
     * @returns This SocketManager.
     * @throws Error if not connected to a server.
     */
    public send(...packets: ClientPacket[]): SocketManager {
        if (this.#socket) {
            this.#socket.send(JSON.stringify(packets));
            this.emit("sentPackets", [packets]);
            return this;
        }

        throw new Error("Unable to send packets to the server; not connected to a server.");
    }

    /**
     * Establish a connection to an Archipelago server before authenticating; useful if there might be tasked that are
     * needed to be performed before authenticating, but after connecting (e.g., DataPackage).
     * @param url The url of the server, including the protocol (e.g., `wss://archipelago.gg:38281`).
     * @returns The {@link RoomInfoPacket} received on initial connection.
     * @remarks If the port is omitted, client will default to `38281`.
     *
     * If the protocol is omitted, client will attempt to connect via `wss`, then fallback to `ws` if unsuccessful.
     */
    public async connect(url: URL | string): Promise<RoomInfoPacket> {
        // Drop any current connection prior to connecting.
        this.disconnect();

        if (typeof url === "string") {
            // Check if protocol was provided and URL is valid-ish, if not we'll add wss and fallback to ws if it fails.
            const pattern = /^([a-zA-Z]+:)(?:\/\/)?[A-Za-z0-9_.~\-:]+/i;
            if (!pattern.test(url)) {
                try {
                    // First try "wss".
                    return await this.connect(new URL(`wss://${url}`));
                } catch {
                    // Nope, try "ws".
                    return await this.connect(new URL(`ws://${url}`));
                }
            }

            // Protocol provided, continue as is.
            url = new URL(url);
        }

        // If port is omitted, default to 38281.
        url.port = url.port || "38281";

        // Disallow any protocols that are not `ws` or `wss`.
        if (url.protocol !== "wss:" && url.protocol !== "ws:") {
            throw new TypeError("Unexpected protocol. Archipelago only supports the ws:// and wss:// protocols.");
        }

        try {
            return new Promise((resolve, reject) => {
                const IsomorphousWebSocket = findWebSocket();
                if (IsomorphousWebSocket === null) {
                    throw new Error("Unable to find a suitable WebSocket API in the current runtime.");
                }

                // Establish a websocket connection and setup basic handlers.
                this.#socket = new IsomorphousWebSocket(url);
                this.#socket.onmessage = this.#parseMessage.bind(this);
                this.#socket.onclose = () => {
                    this.disconnect();
                    reject(new Error("Failed to connect to Archipelago server."));
                };
                this.#socket.onerror = () => {
                    this.disconnect();
                    reject(new Error("Failed to connect to Archipelago server."));
                };
                this.#socket.onopen = () => {
                    this.wait("roomInfo")
                        .then(([packet]) => {
                            this.#connected = true;

                            // Reassign onclose and onerror now that connection looks stable.
                            if (this.#socket) {
                                this.#socket.onclose = this.disconnect.bind(this);
                                this.#socket.onerror = this.disconnect.bind(this);
                                resolve(packet);
                                return;
                            }

                            // Lost socket after connecting somehow? Should never happen, hopefully.
                            this.disconnect();
                            reject(new Error("Failed to connect to Archipelago server."));
                        })
                        .catch((error) => {
                            // Throw error up to the try...catch.
                            throw error;
                        });
                };
            });
        } catch (error) {
            this.disconnect();
            throw error;
        }
    }

    /**
     * Disconnect from the current Archipelago server, if still connected.
     */
    public disconnect(): void {
        // Prevent additional re-runs if already disconnected.
        if (!this.connected) {
            return;
        }

        this.#connected = false;
        this.#socket?.close();
        this.#socket = null;
        this.emit("disconnected", []);
    }

    #parseMessage(event: MessageEvent<string>): void {
        const packets = JSON.parse(event.data) as ServerPacket[];
        for (const packet of packets) {
            switch (packet.cmd) {
                case "ConnectionRefused":
                    this.emit("connectionRefused", [packet]);
                    break;
                case "Bounced":
                    this.emit("bounced", [packet, packet.data]);
                    break;
                case "Connected":
                    this.emit("connected", [packet]);
                    break;
                case "DataPackage":
                    this.emit("dataPackage", [packet]);
                    break;
                case "InvalidPacket":
                    this.emit("invalidPacket", [packet]);
                    break;
                case "LocationInfo":
                    this.emit("locationInfo", [packet]);
                    break;
                case "PrintJSON":
                    if (packet.type === "Chat" || packet.type === "ServerChat") {
                        this.emit("printJSON", [packet, packet.message]);
                    } else {
                        this.emit("printJSON", [packet, packet.data.reduce((prev, value) => prev + value.text, "")]);
                    }
                    break;
                case "ReceivedItems":
                    this.emit("receivedItems", [packet]);
                    break;
                case "Retrieved":
                    this.emit("retrieved", [packet]);
                    break;
                case "RoomInfo":
                    this.emit("roomInfo", [packet]);
                    break;
                case "RoomUpdate":
                    this.emit("roomUpdate", [packet]);
                    break;
                case "SetReply":
                    this.emit("setReply", [packet]);
                    break;
            }

            // Generic-packet listeners only fire after all specific-packet listeners have fired.
            this.emit("receivedPacket", [packet]);
        }
    }
}

/**
 * An interface with all supported socket events and their respective callback arguments. To be called from
 * {@link SocketManager}.
 * @example
 * // Print all chat messages to the console when received.
 * client.socket.on("PrintJSON", (packet, message) => {
 *     console.log(message);
 * });
 *
 * // Warn when lost connection.
 * client.socket.on("Disconnect", () => {
 *     console.warn("Lost connection to the server!");
 * }
 */
export type SocketEvents = {
    /**
     * Fires when the client receives a {@link BouncedPacket}.
     * @param packet The raw {@link BouncedPacket}.
     */
    bounced: [packet: BouncedPacket, data: { [p: string]: JSONSerializableData }]

    /**
     * Fires when the client receives a {@link ConnectedPacket}
     * @param packet The raw {@link ConnectedPacket} packet.
     * @remarks This also means the client has authenticated to an Archipelago server.
     */
    connected: [packet: ConnectedPacket]

    /**
     * Fires when the client receives a {@link ConnectionRefusedPacket}.
     * @param packet The raw {@link ConnectionRefusedPacket}.
     */
    connectionRefused: [packet: ConnectionRefusedPacket]

    /**
     * Fires when the client receives a {@link DataPackagePacket}.
     * @param packet The raw {@link DataPackagePacket}.
     */
    dataPackage: [packet: DataPackagePacket]

    /**
     * Fires when the client receives a {@link InvalidPacketPacket}.
     * @param packet The raw {@link InvalidPacketPacket}.
     */
    invalidPacket: [packet: InvalidPacketPacket]

    /**
     * Fires when the client receives a {@link LocationInfoPacket}.
     * @param packet The raw {@link LocationInfoPacket}.
     */
    locationInfo: [packet: LocationInfoPacket]

    /**
     * Fires when the client receives a {@link PrintJSONPacket}.
     * @param packet The raw {@link PrintJSONPacket} packet.
     * @param message The full plaintext message content.
     */
    printJSON: [packet: PrintJSONPacket, message: string]

    /**
     * Fires when the client receives a {@link ReceivedItemsPacket}.
     * @param packet The raw {@link ReceivedItemsPacket}.
     */
    receivedItems: [packet: ReceivedItemsPacket]

    /**
     * Fires when the client receives a {@link RetrievedPacket}.
     * @param packet The raw {@link RetrievedPacket}.
     */
    retrieved: [packet: RetrievedPacket]

    /**
     * Fires when the client receives a {@link RoomInfoPacket}.
     * @param packet The raw {@link RoomInfoPacket}.
     * @remarks This also means the client has established a websocket connection to an Archipelago server, but not yet
     * authenticated.
     */
    roomInfo: [packet: RoomInfoPacket]

    /**
     * Fires when the client receives a {@link RoomUpdatePacket}.
     * @param packet The raw {@link RoomUpdatePacket}.
     */
    roomUpdate: [packet: RoomUpdatePacket]

    /**
     * Fires when the client receives a {@link SetReplyPacket}.
     * @param packet The raw {@link SetReplyPacket}.
     */
    setReply: [packet: SetReplyPacket]

    /**
     * Fires when the client receives any {@link ServerPacket}.
     * @param packet Any received {@link ServerPacket}. Additional checks on the `cmd` property will be required to
     * determine the type of packet received.
     * @remarks All specific packet event listeners will fire before this event fires.
     */
    receivedPacket: [packet: ServerPacket]

    /**
     * Fires when the client sends an array of {@link ClientPacket}.
     * @param packets An array of {@link ClientPacket} sent to the server.
     */
    sentPackets: [packets: ClientPacket[]]

    /**
     * Fires when the client has lost connection to the server, intentionally or not.
     */
    disconnected: []
};

/**
 * Finds the first appropriate WebSocket prototype available in the current scope.
 * @internal
 * @returns The first WebSocket class available or `null` if none available.
 * @remarks Not all features of the Web WebSocket API maybe available (due to runtime differences), so care should be
 * taken when interacting with the API directly.
 */
function findWebSocket(): typeof WebSocket | null {
    let IsomorphousWebSocket: typeof WebSocket | null = null;
    if (typeof window !== "undefined") {
        // @ts-expect-error WebSocket may not exist in this context.
        IsomorphousWebSocket = window.WebSocket || window.MozWebSocket;
    } else if (typeof global !== "undefined") {
        // @ts-expect-error WebSocket may not exist in this context.
        IsomorphousWebSocket = global.WebSocket || global.MozWebSocket;
    } else if (typeof self !== "undefined") {
        // @ts-expect-error WebSocket may not exist in this context.
        IsomorphousWebSocket = self.WebSocket || self.MozWebSocket;
    } else if (typeof WebSocket !== "undefined") {
        IsomorphousWebSocket = WebSocket;
        // @ts-expect-error WebSocket may not exist in this context.
    } else if (typeof MozWebSocket !== "undefined") {
        // @ts-expect-error WebSocket may not exist in this context.
        IsomorphousWebSocket = MozWebSocket as WebSocket;
    }

    return IsomorphousWebSocket;
}
