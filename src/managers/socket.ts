import {
    BouncedPacket,
    ClientPacket,
    ConnectedPacket,
    ConnectionRefusedPacket,
    DataPackagePacket,
    InvalidPacketPacket,
    LocationInfoPacket,
    PrintJSONPacket,
    ReceivedItemsPacket, RetrievedPacket,
    RoomInfoPacket, RoomUpdatePacket,
    ServerPacket, SetReplyPacket,
} from "../api";
import { Client } from "../client.ts";

/**
 * Manages socket-level communication and exposes helper methods/events for interacting with the Archipelago API
 * directly.
 */
export class SocketManager {
    readonly #client: Client;
    readonly #target: EventTarget = new EventTarget();
    #socket: WebSocket | null = null;
    #connected: boolean = false;

    /** Returns `true` if currently connected to a websocket server. */
    public get connected(): boolean {
        return this.#connected;
    }

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
     * Disconnects from any existing server before establishing a new connection.
     */
    public async connect(url: URL | string): Promise<RoomInfoPacket> {
        // Drop any current connection prior to connecting.
        // this.disconnect(); // TODO: Write this.

        if (typeof url === "string") {
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
                    reject(new Error("WebSocket closed unexpectedly. Is there a server listening on that URL?"));
                };

                this.#socket.onopen = async () => {
                    const [packet] = await this.once("RoomInfo");
                    this.#connected = true;
                    resolve(packet);
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
    }

    /**
     * Add an event listener for a specific server packet or any server packets.
     * @param event The packet event name to listen for.
     * @param listener The callback function to fire when the event is emitted.
     * @remarks For details on the supported events and the arguments returned for each event type, see
     * {@link SocketEvents}.
     */
    public on<Event extends keyof SocketEvents>(event: Event, listener: (...args: SocketEvents[Event]) => void): void {
        this.#target.addEventListener(event, listener as unknown as EventListener);
    }

    /**
     * Removes an existing event listener.
     * @param event The event name associated with the listener to remove.
     * @param listener The callback function to remove.
     * @remarks For details on the supported events and the arguments returned for each event type, see
     * {@link SocketEvents}.
     */
    public off<Event extends keyof SocketEvents>(event: Event, listener: (...args: SocketEvents[Event]) => void): void {
        this.#target.removeEventListener(event, listener as unknown as EventListener);
    }

    /**
     * Returns a promise that waits for a single specified packet event to be received. Resolves with a list of
     * arguments dispatched with the event.
     * @param event The packet name to listen for.
     * @remarks For details on the supported events and the arguments returned for each event type, see
     * {@link SocketEvents}.
     */
    public async once<Event extends keyof SocketEvents>(event: Event): Promise<SocketEvents[Event]> {
        return new Promise<SocketEvents[Event]>((resolve) => {
            const listener = (packet: SocketEvents[Event]) => resolve(packet);
            this.#target.addEventListener(event, listener as unknown as EventListener, { once: true });
        });
    }

    #emit<Event extends keyof SocketEvents>(event: Event, detail: SocketEvents[Event]): void {
        this.#target.dispatchEvent(new CustomEvent(event, { detail, cancelable: true }));
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
 * client.api.on("PrintJSON", (packet, message) => {
 *     console.log(message);
 * });
 *
 * // Warn when lost connection.
 * client.api.on("Disconnect", () => {
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
