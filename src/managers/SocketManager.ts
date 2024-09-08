import { ClientPacket, NetworkPackets as NP, ServerPacket, ServerPacketType } from "../api/index.ts";
import { ConnectionStatus } from "../enums/ConnectionStatus.ts";
import { APEventEmitter, APEventUnsubscribe } from "../utils/APEventEmitter.ts";
import { IsomorphousWebSocket } from "../utils/IsomorphousWebSocket.ts";

/**
 * Manages the web socket and API-level communication.
 * @remarks Library subscribers should use the abstracted helper functions/structs instead of interacting with the api
 * or socket directly, but it is exposed if necessary.
 */
export class SocketManager {
    #events: APEventEmitter;
    #socket: WebSocket | null = null;
    #status: ConnectionStatus = ConnectionStatus.Disconnected;

    /**
     * Get the current WebSocket connection status to the Archipelago server.
     * @returns The current connection status.
     */
    public get status(): ConnectionStatus {
        return this.#status;
    }

    /**
     * Get the URL of the current connection, including protocol.
     * @returns The current connection URL or `null` if not connected.
     */
    public get url(): string | null {
        if (this.#socket) {
            return this.#socket.url;
        }

        return null;
    }

    /**
     * Creates a new SocketManager.
     * @internal
     * @param events The {@link APEventEmitter} object attached to {@link ArchipelagoClient}.
     */
    public constructor(events: APEventEmitter) {
        this.#events = events;
    }

    /**
     * Connect to an Archipelago server without authenticating.
     * @internal
     * @param url The url of the server, including the protocol (e.g., `wss://archipelago.gg:38281`).
     * @remarks If the port is omitted, `url` will default to `38281`. If server is not listening on the protocol used
     * to connect, it will not automatically reattempt with another supported protocol.
     */
    public async connect(url: URL | string): Promise<void> {
        if (typeof url === "string") {
            url = new URL(url);
        }

        // If port is omitted, default to 38281.
        url.port = url.port || "38281";

        // Disallow any protocols that aren't "ws" or "wss".
        if (url.protocol !== "wss:" && url.protocol !== "ws:") {
            throw new TypeError(`Connection supports ws:// or wss:// protocol only: ${url.protocol}// is not valid.`);
        }

        this.disconnect();
        try {
            await new Promise<void>((resolve, reject) => {
                if (IsomorphousWebSocket === null) {
                    throw new Error("Unable to find a suitable WebSocket API.");
                }

                // Establish a connection and setup basic handlers.
                this.#socket = new IsomorphousWebSocket(url);
                this.#socket.onopen = () => {
                    this.#status = ConnectionStatus.Unauthenticated;

                    // Wait for RoomInfo packet or timeout after 10 seconds with no packet.
                    const timeout = setTimeout(() => {
                        unsub();
                        reject(new Error(
                            "Client did not receive RoomInfo packet within 10 seconds of establishing connection. "
                            + "Is this an Archipelago server?",
                        ));
                    }, 10_000);
                    const unsub = this.subscribe("onRoomInfo", () => {
                        clearTimeout(timeout);
                        unsub();
                        resolve();
                    });
                };
                this.#socket.onerror = () => {
                    this.disconnect(false); // Already being closed.
                    reject(new Error("Socket closed unexpectedly. Is there a server listening on that URL?"));
                };
                this.#socket.onmessage = (event: MessageEvent<string>) => {
                    this.#parsePackets(JSON.parse(event.data) as ServerPacket[]);
                };
            });

            this.#events.dispatchEvent(new Event("_Connected"));
        } catch (error) {
            // Reset socket state, then rethrow.
            this.disconnect();
            throw error;
        }
    }

    /**
     * Disconnect from the current Archipelago server and/or reset internal state.
     * @internal
     * @param closeSocket Should an attempt be made to close socket? Leave as default unless you know what you're doing.
     */
    public disconnect(closeSocket = true): void {
        if (closeSocket) {
            // If this fails for whatever reason, we don't want to completely crash, but still set status.
            try {
                this.#socket?.close();
            } finally {}
        }
        this.#socket = null;
        this.#status = ConnectionStatus.Disconnected;

        this.#events.dispatchEvent(new Event("onDisconnected"));
    }

    /**
     * Sends client packet(s) to the server.
     * @internal
     * @param packets A list of packets to send, to be processed in order defined.
     * @throws Error If not connected to an Archipelago server.
     */
    public send(...packets: ClientPacket[]): void {
        if (!this.#socket) {
            throw new Error("Unable to send packets; not connected to a server.");
        }

        this.#socket.send(JSON.stringify(packets));
    }

    public subscribe(type: "onBounced", callback: (packet: NP.BouncedPacket) => void): APEventUnsubscribe;
    public subscribe(type: "onConnected", callback: (packet: NP.ConnectedPacket) => void): APEventUnsubscribe;
    public subscribe(type: "onConnectionRefused", callback: (packet: NP.ConnectionRefusedPacket) => void): APEventUnsubscribe;
    public subscribe(type: "onDataPackage", callback: (packet: NP.DataPackagePacket) => void): APEventUnsubscribe;
    public subscribe(type: "onInvalidPacket", callback: (packet: NP.InvalidPacketPacket) => void): APEventUnsubscribe;
    public subscribe(type: "onLocationInfo", callback: (packet: NP.LocationInfoPacket) => void): APEventUnsubscribe;
    public subscribe(type: "onPrintJSON", callback: (packet: NP.PrintJSONPacket) => void): APEventUnsubscribe;
    public subscribe(type: "onReceivedItems", callback: (packet: NP.ReceivedItemsPacket) => void): APEventUnsubscribe;
    public subscribe(type: "onRetrieved", callback: (packet: NP.RetrievedPacket) => void): APEventUnsubscribe;
    public subscribe(type: "onRoomInfo", callback: (packet: NP.RoomInfoPacket) => void): APEventUnsubscribe;
    public subscribe(type: "onRoomUpdate", callback: (packet: NP.RoomUpdatePacket) => void): APEventUnsubscribe;
    public subscribe(type: "onSetReply", callback: (packet: NP.SetReplyPacket) => void): APEventUnsubscribe;
    public subscribe(type: "onAnyPacket", callback: (packet: ServerPacket) => void): APEventUnsubscribe;
    public subscribe(type: "onDisconnected", callback: () => void): APEventUnsubscribe;

    /**
     * Subscribe to an incoming server event.
     * @internal
     * @param type The type of packet/event to listen for.
     *
     * Recognized events includes any individual Network Protocol packet, `Any` which fires whenever any network
     * protocol packet is received, or `OnDisconnect` which fires if the socket closes for whatever reason.
     * @param callback The callback to run when the event fires. Callback argument includes packet (excluding
     * `OnDisconnect`).
     * @returns An unsubscribe function to remove event listener, when no longer needed.
     */
    public subscribe(type: SubscriptionEvent, callback: (packet: never) => void | (() => void)): APEventUnsubscribe {
        const subscribe = this.#events.createSubscriber<ServerPacket>(type);
        return subscribe(callback as (packet: ServerPacket) => void);
    }

    #parsePackets(packets: ServerPacket[]): void {
        for (const packet of packets) {
            this.#dispatch(packet.cmd, packet);
            this.#dispatch("Any", packet);
        }
    }

    #dispatch(type: ServerPacketType | "Any", packet: ServerPacket): void {
        this.#events.dispatchEvent(new CustomEvent<ServerPacket>(type, { detail: packet }));
    }
}

type SubscriptionEvent =
    | "onBounced"
    | "onConnected"
    | "onConnectionRefused"
    | "onDataPackage"
    | "onInvalidPacket"
    | "onLocationInfo"
    | "onPrintJSON"
    | "onReceivedItems"
    | "onRetrieved"
    | "onRoomInfo"
    | "onRoomUpdate"
    | "onSetReply"
    | "onAnyPacket"
    | "onDisconnected";
