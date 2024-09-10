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
} from "../api/packets";
import { APSocketError } from "../errors.ts";
import { APEventUnsubscribe, createSubscriber, findWebSocket } from "../utils.ts";

export class SocketManager {
    readonly #events: EventTarget = new EventTarget();
    #socket: WebSocket | null = null;
    #connected: boolean = false;

    /**
     * Instantiates a new SocketManager.
     * @internal
     */
    public constructor() {}

    /** Returns `true` if currently connected to an Archipelago server. */
    public get connected(): boolean {
        return this.#connected;
    }

    /** Returns the url of the current connection or `null` if not connected. */
    public get url(): string | null {
        if (this.connected && this.#socket) {
            // Strip parts of the url that don't actually matter as connection args are stored separately.
            const url = new URL(this.#socket.url);
            return `${url.protocol}//${url.host}`;
        }

        return null;
    }

    /**
     * Connect to an Archipelago server without authenticating.
     * @param url The url of the server, including the protocol (e.g., `wss://archipelago.gg:38281`).
     * @remarks If the port is omitted, manager will default to `38281`. Any paths, queries, fragments, or userinfo
     * components of the provided URL will be ignored.
     */
    public async connect(url: URL | string): Promise<void> {
        // Drop any current connection from this client.
        this.disconnect();

        if (typeof url === "string") {
            url = new URL(url);
        }

        // If port is omitted, default to 38281.
        url.port = url.port || "38281";

        // Disallow any protocols that aren't "ws" or "wss".
        if (url.protocol !== "wss:" && url.protocol !== "ws:") {
            throw new TypeError(`Connection supports ws:// or wss:// protocol only: ${url.protocol}// is not valid.`);
        }

        try {
            await new Promise<void>((resolve, reject) => {
                const IsomorphousWebSocket = findWebSocket();
                if (IsomorphousWebSocket === null) {
                    throw new APSocketError("Unable to find a suitable WebSocket API.");
                }

                // Establish a connection and setup basic handlers.
                this.#socket = new IsomorphousWebSocket(url);
                this.#socket.onclose = this.disconnect.bind(this);
                this.#socket.onopen = () => {
                    this.#connected = true;

                    // Wait for RoomInfo packet or timeout after 10 seconds with no packet.
                    const timeout = setTimeout(() => {
                        unsub();
                        reject(new APSocketError(
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
                    reject(new APSocketError("Socket closed unexpectedly. Is there a server listening on that URL?"));
                };
                this.#socket.onmessage = (event: MessageEvent<string>) => {
                    this.#onPacketsReceived(JSON.parse(event.data) as ServerPacket[]);
                };
            });

            this.#events.dispatchEvent(new Event("_Connected"));
        } catch (error) {
            this.disconnect();
            throw error;
        }
    }

    /**
     * Disconnect from the current Archipelago server, if still connected, and reset internal state.
     */
    public disconnect(): void {
        // Prevents additional re-runs if already disconnected.
        if (!this.connected) {
            return;
        }

        this.#connected = false;
        this.#socket?.close();
        this.#socket = null;
        this.#events.dispatchEvent(new Event("onDisconnected"));
    }

    /**
     * Send client packet(s) to the server.
     * @param packets A list of packets to send, to be processed in order defined.
     * @throws {@link ArchipelagoErrors.APSocketError} if not connected to an Archipelago server.
     */
    public send(...packets: ClientPacket[]): void {
        if (!this.#socket) {
            throw new APSocketError("Unable to send packet(s); not connected to a server.");
        }

        this.#socket.send(JSON.stringify(packets));
    }

    /**
     * Subscribe to incoming {@link BouncedPacket} packet events.
     * @param type The type of event to listen for.
     * @param callback The callback to run when this event occurs.
     * @returns An unsubscribe function to remove event listener. Event listeners are not automatically unsubscribed on
     * a disconnection event.
     */
    public subscribe(type: "onBounced", callback: (packet: BouncedPacket) => void): APEventUnsubscribe;

    /**
     * Subscribe to incoming {@link ConnectedPacket} packet events.
     * @param type The type of event to listen for.
     * @param callback The callback to run when this event occurs.
     * @returns An unsubscribe function to remove event listener. Event listeners are not automatically unsubscribed on
     * a disconnection event.
     */
    public subscribe(type: "onConnected", callback: (packet: ConnectedPacket) => void): APEventUnsubscribe;

    /**
     * Subscribe to incoming {@link ConnectionRefusedPacket} packet events.
     * @param type The type of event to listen for.
     * @param callback The callback to run when this event occurs.
     * @returns An unsubscribe function to remove event listener. Event listeners are not automatically unsubscribed on
     * a disconnection event.
     */
    public subscribe(type: "onConnectionRefused", callback: (packet: ConnectionRefusedPacket) => void): APEventUnsubscribe;

    /**
     * Subscribe to incoming {@link DataPackagePacket} packet events.
     * @param type The type of event to listen for.
     * @param callback The callback to run when this event occurs.
     * @returns An unsubscribe function to remove event listener. Event listeners are not automatically unsubscribed on
     * a disconnection event.
     */
    public subscribe(type: "onDataPackage", callback: (packet: DataPackagePacket) => void): APEventUnsubscribe;

    /**
     * Subscribe to incoming {@link InvalidPacketPacket} packet events.
     * @param type The type of event to listen for.
     * @param callback The callback to run when this event occurs.
     * @returns An unsubscribe function to remove event listener. Event listeners are not automatically unsubscribed on
     * a disconnection event.
     */
    public subscribe(type: "onInvalidPacket", callback: (packet: InvalidPacketPacket) => void): APEventUnsubscribe;

    /**
     * Subscribe to incoming {@link LocationInfoPacket} packet events.
     * @param type The type of event to listen for.
     * @param callback The callback to run when this event occurs.
     * @returns An unsubscribe function to remove event listener. Event listeners are not automatically unsubscribed on
     * a disconnection event.
     */
    public subscribe(type: "onLocationInfo", callback: (packet: LocationInfoPacket) => void): APEventUnsubscribe;

    /**
     * Subscribe to incoming {@link PrintJSONPacket} packet events.
     * @param type The type of event to listen for.
     * @param callback The callback to run when this event occurs.
     * @returns An unsubscribe function to remove event listener. Event listeners are not automatically unsubscribed on
     * a disconnection event.
     */
    public subscribe(type: "onPrintJSON", callback: (packet: PrintJSONPacket) => void): APEventUnsubscribe;

    /**
     * Subscribe to incoming {@link ReceivedItemsPacket} packet events.
     * @param type The type of event to listen for.
     * @param callback The callback to run when this event occurs.
     * @returns An unsubscribe function to remove event listener. Event listeners are not automatically unsubscribed on
     * a disconnection event.
     */
    public subscribe(type: "onReceivedItems", callback: (packet: ReceivedItemsPacket) => void): APEventUnsubscribe;

    /**
     * Subscribe to incoming {@link RetrievedPacket} packet events.
     * @param type The type of event to listen for.
     * @param callback The callback to run when this event occurs.
     * @returns An unsubscribe function to remove event listener. Event listeners are not automatically unsubscribed on
     * a disconnection event.
     */
    public subscribe(type: "onRetrieved", callback: (packet: RetrievedPacket) => void): APEventUnsubscribe;

    /**
     * Subscribe to incoming {@link RoomInfoPacket} packet events.
     * @param type The type of event to listen for.
     * @param callback The callback to run when this event occurs.
     * @returns An unsubscribe function to remove event listener. Event listeners are not automatically unsubscribed on
     * a disconnection event.
     */
    public subscribe(type: "onRoomInfo", callback: (packet: RoomInfoPacket) => void): APEventUnsubscribe;

    /**
     * Subscribe to incoming {@link RoomUpdatePacket} packet events.
     * @param type The type of event to listen for.
     * @param callback The callback to run when this event occurs.
     * @returns An unsubscribe function to remove event listener. Event listeners are not automatically unsubscribed on
     * a disconnection event.
     */
    public subscribe(type: "onRoomUpdate", callback: (packet: RoomUpdatePacket) => void): APEventUnsubscribe;

    /**
     * Subscribe to incoming {@link SetReplyPacket} packet events.
     * @param type The type of event to listen for.
     * @param callback The callback to run when this event occurs.
     * @returns An unsubscribe function to remove event listener. Event listeners are not automatically unsubscribed on
     * a disconnection event.
     */
    public subscribe(type: "onSetReply", callback: (packet: SetReplyPacket) => void): APEventUnsubscribe;

    /**
     * Subscribe to any incoming network protocol packet events.
     * @param type The type of event to listen for.
     * @param callback The callback to run when this event occurs.
     * @returns An unsubscribe function to remove event listener. Event listeners are not automatically unsubscribed on
     * a disconnection event.
     */
    public subscribe(type: "onPacketReceived", callback: (packet: ServerPacket) => void): APEventUnsubscribe;

    /**
     * Subscribe to disconnection events.
     * @param type The type of event to listen for.
     * @param callback The callback to run when this event occurs.
     * @returns An unsubscribe function to remove event listener. Event listeners are not automatically unsubscribed on
     * a disconnection event.
     */
    public subscribe(type: "onDisconnected", callback: () => void): APEventUnsubscribe;

    public subscribe(type: SubscriptionEventType, callback: (packet: never) => void | (() => void)): APEventUnsubscribe {
        const subscribe = createSubscriber<ServerPacket>(this.#events, type);
        return subscribe(callback as (packet: ServerPacket) => void);
    }

    #onPacketsReceived(packets: ServerPacket[]): void {
        for (const packet of packets) {
            this.#dispatch(`on${packet.cmd}`, packet);
            this.#dispatch("onPacketReceived", packet);
        }
    }

    #dispatch(type: SubscriptionEventType, packet: ServerPacket): void {
        this.#events.dispatchEvent(new CustomEvent<ServerPacket>(type, { detail: packet }));
    }
}

type SubscriptionEventType =
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
    | "onPacketReceived"
    | "onDisconnected";
