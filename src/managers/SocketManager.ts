import { AbstractSlotData, ClientPacket, ClientPacketType, ItemsHandlingFlags, ServerPacket } from "../api";
import {
    BouncedPacket,
    ConnectedPacket,
    ConnectionRefusedPacket,
    ConnectPacket,
    DataPackagePacket,
    InvalidPacketPacket,
    LocationInfoPacket,
    PrintJSONPacket,
    ReceivedItemsPacket,
    RetrievedPacket,
    RoomInfoPacket,
    RoomUpdatePacket,
    SetReplyPacket,
} from "../api/packets";
import { ArchipelagoClient } from "../ArchipelagoClient.ts";
import { CommonTags } from "../consts/CommonTags.ts";
import { ConnectionStatus } from "../enums/ConnectionStatus.ts";
import { ConnectArguments } from "../types/ConnectArguments.ts";
import { APEventEmitter, APEventUnsubscribe } from "../utils/APEventEmitter.ts";
import { IsomorphousWebSocket } from "../utils/IsomorphousWebSocket.ts";
import { generateUUIDv4 } from "../utils/UUIDGenerator.ts";

/**
 * Manages the web socket and API-level communication.
 * @remarks Library subscribers should use the abstracted helper functions/structs instead of interacting with the api
 * or socket directly, but it is exposed if necessary.
 */
export class SocketManager {
    readonly #client: ArchipelagoClient<AbstractSlotData>;
    readonly #events: APEventEmitter = new APEventEmitter();
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
     * @param client The Archipelago client.
     */
    public constructor(client: ArchipelagoClient<AbstractSlotData>) {
        this.#client = client;
    }

    /**
     * Connect to an Archipelago server without authenticating.
     * @internal
     * @param url The url of the server, including the protocol (e.g., `wss://archipelago.gg:38281`).
     * @remarks If the port is omitted, `url` will default to `38281`. If server is not listening on the protocol used
     * to connect, it will not automatically reattempt with another supported protocol.
     */
    public async connect(url: URL | string): Promise<void> {
        // Disconnect before establishing a new connection.
        if (this.status !== ConnectionStatus.Disconnected) {
            this.disconnect();
        }

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
                if (IsomorphousWebSocket === null) {
                    throw new Error("Unable to find a suitable WebSocket API.");
                }

                // Establish a connection and setup basic handlers.
                this.#socket = new IsomorphousWebSocket(url);
                this.#socket.onclose = () => this.disconnect(false);
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
     * Attempt to authenticate and connect to a slot on an already connected Archipelago server.
     * @internal
     * @param name The slot name chosen by the player prior to generation.
     * @param options Additional optional connection arguments, see {@link ConnectArguments} for more details.
     */
    public async authenticate(name: string, options: ConnectArguments = {}): Promise<void> {
        if (this.#status === ConnectionStatus.Disconnected) {
            throw Error("Cannot authenticate until connected to server.");
        }

        if (name === "") {
            throw Error("Slot name cannot be blank.");
        }

        const password = options.password || "";
        const uuid = options.uuid || generateUUIDv4();
        const tags = new Set(options.tags || []);
        const version = options.targetVersion || { major: 0, minor: 5, build: 0 }; // Targeted version for this library.
        const slotData = options.requestSlotData || true;

        if (this.#client.room.password && password === "") {
            throw Error("Room requires a password to authenticate and none was provided.");
        }

        // Validate version.
        if (
            !Number.isSafeInteger(version.major)
            || !Number.isSafeInteger(version.minor)
            || !Number.isSafeInteger(version.build)
            || version.major < 0
            || version.minor < 0
            || version.build < 0
        ) {
            throw RangeError("Each component of `targetVersion` must be a non-negative integer.");
        }

        // Tag shortcuts.
        if (options.isHintGame) {
            tags.add(CommonTags.HINT_GAME);
        } else if (options.isTracker) {
            tags.add(CommonTags.TRACKER);
        } else if (options.isTextOnly) {
            tags.add(CommonTags.TEXT_ONLY);
        }

        // Items handling shorthands.
        let itemsHandling: number = ItemsHandlingFlags.REMOTE_MINIMAL;
        switch (options.subscribedItemEvents || "all") {
            case "all":
                itemsHandling = ItemsHandlingFlags.REMOTE_ALL;
                break;
            case "exclude-self":
                itemsHandling = ItemsHandlingFlags.REMOTE_DIFFERENT_WORLDS & ItemsHandlingFlags.REMOTE_STARTING_INVENTORY;
                break;
            case "exclude-starting-inventory":
                itemsHandling = ItemsHandlingFlags.REMOTE_DIFFERENT_WORLDS & ItemsHandlingFlags.REMOTE_OWN_WORLD;
                break;
            case "external-only":
                itemsHandling = ItemsHandlingFlags.REMOTE_DIFFERENT_WORLDS;
                break;
            case "minimal":
                itemsHandling = ItemsHandlingFlags.REMOTE_MINIMAL;
                break;
        }

        const connectPacket: ConnectPacket = {
            cmd: ClientPacketType.Connect,
            game: this.#client.game,
            name,
            password,
            slot_data: slotData,
            items_handling: itemsHandling,
            tags: Array.from(tags),
            uuid,
            version: { ...version, class: "Version" },
        };

        await new Promise<void>((resolve, reject) => {
            // Setup event handlers.
            const unsubConnect = this.subscribe("onConnected", () => {
                this.#status = ConnectionStatus.Connected;
                unsubConnect();
                unsubRefused();
                resolve(); // TODO: Should return self-player information.
            });
            const unsubRefused = this.subscribe("onConnectionRefused", (packet) => {
                unsubConnect();
                unsubRefused();
                reject(new Error(`Connection was refused. Reason(s): [${packet.errors?.join(", ")}]`));
            });

            this.send(connectPacket);
        });
    }

    /**
     * Disconnect from the current Archipelago server and/or reset internal state.
     * @internal
     * @param closeSocket Should an attempt be made to close socket? Leave as default unless you know what you're doing.
     */
    public disconnect(closeSocket = true): void {
        if (this.status === ConnectionStatus.Disconnected) {
            return;
        }

        this.#status = ConnectionStatus.Disconnected;
        try {
            if (closeSocket) {
                this.#socket?.close();
            }
        } finally {
            this.#socket = null;
        }

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

    public subscribe(type: "onBounced", callback: (packet: BouncedPacket) => void): APEventUnsubscribe;
    public subscribe(type: "onConnected", callback: (packet: ConnectedPacket) => void): APEventUnsubscribe;
    public subscribe(type: "onConnectionRefused", callback: (packet: ConnectionRefusedPacket) => void): APEventUnsubscribe;
    public subscribe(type: "onDataPackage", callback: (packet: DataPackagePacket) => void): APEventUnsubscribe;
    public subscribe(type: "onInvalidPacket", callback: (packet: InvalidPacketPacket) => void): APEventUnsubscribe;
    public subscribe(type: "onLocationInfo", callback: (packet: LocationInfoPacket) => void): APEventUnsubscribe;
    public subscribe(type: "onPrintJSON", callback: (packet: PrintJSONPacket) => void): APEventUnsubscribe;
    public subscribe(type: "onReceivedItems", callback: (packet: ReceivedItemsPacket) => void): APEventUnsubscribe;
    public subscribe(type: "onRetrieved", callback: (packet: RetrievedPacket) => void): APEventUnsubscribe;
    public subscribe(type: "onRoomInfo", callback: (packet: RoomInfoPacket) => void): APEventUnsubscribe;
    public subscribe(type: "onRoomUpdate", callback: (packet: RoomUpdatePacket) => void): APEventUnsubscribe;
    public subscribe(type: "onSetReply", callback: (packet: SetReplyPacket) => void): APEventUnsubscribe;
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
            this.#dispatchPacketEvent(`on${packet.cmd}`, packet);
            this.#dispatchPacketEvent("onAnyPacket", packet);
        }
    }

    #dispatchPacketEvent(type: SubscriptionEvent, packet: ServerPacket): void {
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
