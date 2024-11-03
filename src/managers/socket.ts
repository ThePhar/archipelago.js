import {
    BouncedPacket,
    ClientPacket,
    ConnectedPacket,
    ConnectionRefusedPacket,
    DataPackagePacket,
    InvalidPacketPacket,
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
import { ArchipelagoEventEmitter } from "../events.ts";

/**
 * Manages socket-level communication and exposes helper methods/events for interacting with the Archipelago API
 * directly.
 */
export class SocketManager {
    readonly #client: Client;
    readonly #target = new ArchipelagoEventEmitter();
    #socket: WebSocket | null = null;
    #connected: boolean = false;

    /** Returns `true` if currently connected to a websocket server. */
    public get connected(): boolean {
        return this.#connected;
    }

    /**
     * Instantiates a new SocketManager. Should only be instantiated by creating a new {@link Client}.
     * @internal
     * @param client The client object this manager is associated with.
     */
    public constructor(client: Client) {
        this.#client = client;
    }

    /**
     * Send a list of raw client packets to the server.
     * @param packets List of client packets to send.
     */
    public send(...packets: ClientPacket[]): void {
        if (this.#socket) {
            this.#socket.send(JSON.stringify(packets));
            return;
        }

        console.error("Unable to send packets to the server; not connected to a server.");
    }

    /**
     * Establish a connection to an Archipelago server and returns the {@link RoomInfoPacket}.
     * @param url The url of the server, including the protocol (e.g., `wss://archipelago.gg:38281`).
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
                    return this.connect(new URL(`wss://${url}`));
                } catch {
                    // Nope, try "ws".
                    return this.connect(new URL(`ws://${url}`));
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
                this.#socket.onclose = this.disconnect.bind(this);
                this.#socket.onmessage = this.#parseMessage.bind(this);
                this.#socket.onerror = () => {
                    this.disconnect();
                    reject(new Error("Websocket closed unexpectedly."));
                };
                this.#socket.onopen = () => {
                    this.once("RoomInfo")
                        .then(([packet]) => {
                            this.#connected = true;
                            resolve(packet);
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
        this.#emit("Disconnect", []);
    }

    /**
     * Add an event listener for a specific server packet or any server packets.
     * @param event The packet event name to listen for.
     * @param listener The callback function to fire when the event is emitted.
     * @remarks For details on the supported events and the arguments returned for each event type, see
     * {@link SocketEvents}.
     */
    public on<SocketEvent extends keyof SocketEvents>(event: SocketEvent, listener: (...args: SocketEvents[SocketEvent]) => void): SocketManager {
        this.#target.addEventListener(event, listener);
        return this;
    }

    /**
     * Removes an existing event listener.
     * @param event The event name associated with the listener to remove.
     * @param listener The callback function to remove.
     * @remarks For details on the supported events and the arguments returned for each event type, see
     * {@link SocketEvents}.
     */
    public off<SocketEvent extends keyof SocketEvents>(event: SocketEvent, listener: (...args: SocketEvents[SocketEvent]) => void): SocketManager {
        this.#target.removeEventListener(event, listener);
        return this;
    }

    /**
     * Returns a promise that waits for a single specified packet event to be received. Resolves with a list of
     * arguments dispatched with the event.
     * @param event The packet name to listen for.
     * @remarks For details on the supported events and the arguments returned for each event type, see
     * {@link SocketEvents}.
     */
    public async once<SocketEvent extends keyof SocketEvents>(event: SocketEvent): Promise<SocketEvents[SocketEvent]> {
        return new Promise<SocketEvents[SocketEvent]>((resolve, reject) => {
            const timeout = setTimeout(
                // TODO: Replace with custom error object that can export the reasons easier.
                () => reject(new Error("Server has not responded in time.")),
                this.#client.options.timeout,
            );
            const listener = (...args: SocketEvents[SocketEvent]) => {
                clearTimeout(timeout);
                resolve(args);
            };

            this.#target.addEventListener(event, listener, true);
        });
    }

    #emit<Event extends keyof SocketEvents>(event: Event, detail: SocketEvents[Event]): void {
        this.#target.dispatchEvent(event, detail);
    }

    #parseMessage(event: MessageEvent<string>): void {
        const packets = JSON.parse(event.data) as ServerPacket[];
        for (const packet of packets) {
            switch (packet.cmd) {
                case "ConnectionRefused":
                    this.#emit("ConnectionRefused", [packet]);
                    break;
                case "Bounced":
                    this.#emit("Bounced", [packet]);
                    break;
                case "Connected":
                    this.#emit("Connected", [packet]);
                    break;
                case "DataPackage":
                    this.#emit("DataPackage", [packet]);
                    break;
                case "InvalidPacket":
                    this.#emit("InvalidPacket", [packet]);
                    break;
                case "LocationInfo":
                    this.#emit("LocationInfo", [packet]);
                    break;
                case "PrintJSON":
                    if (packet.type === "Chat" || packet.type === "ServerChat") {
                        this.#emit("PrintJSON", [packet, packet.message]);
                    } else {
                        this.#emit("PrintJSON", [packet, packet.data.reduce((prev, value) => prev + value.text, "")]);
                    }
                    break;
                case "ReceivedItems":
                    this.#emit("ReceivedItems", [packet]);
                    break;
                case "Retrieved":
                    this.#emit("Retrieved", [packet]);
                    break;
                case "RoomInfo":
                    this.#emit("RoomInfo", [packet]);
                    break;
                case "RoomUpdate":
                    this.#emit("RoomUpdate", [packet]);
                    break;
                case "SetReply":
                    this.#emit("SetReply", [packet]);
                    break;
            }

            // Generic-packet listeners only fire after all specific-packet listeners have fired.
            this.#emit("AnyPacket", [packet]);
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
export interface SocketEvents {
    /**
     * Fires when the client receives a {@link BouncedPacket}.
     * @param packet The raw {@link BouncedPacket}.
     */
    Bounced: [packet: BouncedPacket]

    /**
     * Fires when the client receives a {@link ConnectedPacket}
     * @param packet The raw {@link ConnectedPacket} packet.
     * @remarks This also means the client has authenticated to an Archipelago server.
     */
    Connected: [packet: ConnectedPacket]

    /**
     * Fires when the client receives a {@link ConnectionRefusedPacket}.
     * @param packet The raw {@link ConnectionRefusedPacket}.
     */
    ConnectionRefused: [packet: ConnectionRefusedPacket]

    /**
     * Fires when the client receives a {@link DataPackagePacket}.
     * @param packet The raw {@link DataPackagePacket}.
     */
    DataPackage: [packet: DataPackagePacket]

    /**
     * Fires when the client receives a {@link InvalidPacketPacket}.
     * @param packet The raw {@link InvalidPacketPacket}.
     */
    InvalidPacket: [packet: InvalidPacketPacket]

    /**
     * Fires when the client receives a {@link LocationInfoPacket}.
     * @param packet The raw {@link LocationInfoPacket}.
     */
    LocationInfo: [packet: LocationInfoPacket]

    /**
     * Fires when the client receives a {@link PrintJSONPacket}.
     * @param packet The raw {@link PrintJSONPacket} packet.
     * @param message The full plaintext message content.
     */
    PrintJSON: [packet: PrintJSONPacket, message: string]

    /**
     * Fires when the client receives a {@link ReceivedItemsPacket}.
     * @param packet The raw {@link ReceivedItemsPacket}.
     */
    ReceivedItems: [packet: ReceivedItemsPacket]

    /**
     * Fires when the client receives a {@link RetrievedPacket}.
     * @param packet The raw {@link RetrievedPacket}.
     */
    Retrieved: [packet: RetrievedPacket]

    /**
     * Fires when the client receives a {@link RoomInfoPacket}.
     * @param packet The raw {@link RoomInfoPacket}.
     * @remarks This also means the client has established a websocket connection to an Archipelago server, but not yet
     * authenticated.
     */
    RoomInfo: [packet: RoomInfoPacket]

    /**
     * Fires when the client receives a {@link RoomUpdatePacket}.
     * @param packet The raw {@link RoomUpdatePacket}.
     */
    RoomUpdate: [packet: RoomUpdatePacket]

    /**
     * Fires when the client receives a {@link SetReplyPacket}.
     * @param packet The raw {@link SetReplyPacket}.
     */
    SetReply: [packet: SetReplyPacket]

    /**
     * Fires when the client receives any {@link ServerPacket}.
     * @param packet Any received {@link ServerPacket}. Additional checks on the `cmd` property will be required to
     * determine the type of packet received.
     * @remarks All specific packet event listeners will fire before this event fires.
     */
    AnyPacket: [packet: ServerPacket]

    /**
     * Fires when the client has lost connection to the server, intentionally or not.
     */
    Disconnect: []
}

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
