import { ClientStatus, ItemsHandlingFlags } from "../api";
import { ClientPacket, ConnectPacket, ServerPacket } from "../api/packets";
import { CommonTags } from "../consts/CommonTags.ts";
import { APSocketError } from "../errors.ts";
import { APIManager } from "../managers/APIManager.ts";
import { ChatManager } from "../managers/ChatManager.ts";
import { DataManager } from "../managers/DataManager.ts";
import { ItemsManager } from "../managers/ItemsManager.ts";
import { LocationsManager } from "../managers/LocationsManager.ts";
import { PlayersManager } from "../managers/PlayersManager.ts";
import { RoomManager } from "../managers/RoomManager.ts";
import { ConnectionArguments } from "../types/ConnectionArguments.ts";
import { createDefaultConnectionArgs, findWebSocket } from "../utils.ts";

/**
 * The client that connects to an Archipelago server, facilitates communication, and keeps track of room/player state.
 * @example
 * import { ArchipelagoClient } from "@pharware/archipelago";
 *
 * const client = new ArchipelagoClient();
 */
export class ArchipelagoClient {
    readonly #events: EventTarget = new EventTarget();
    #socket: WebSocket | null = null;
    #connected: boolean = false;
    #args: Required<ConnectionArguments> = createDefaultConnectionArgs();
    #name: string = "";
    #game: string = "";

    /** A helper object for logging and sending messages via the Archipelago chat. */
    public readonly chat: ChatManager = new ChatManager(this);
    /** A helper object for tracking and communciating to/from the AP data storage and data package. */
    public readonly data: DataManager = new DataManager(this);
    /** A helper object for tracking received items in the session. */
    public readonly items: ItemsManager = new ItemsManager(this);
    /** A helper object for tracking, scouting, and checking locations in the session. */
    public readonly locations: LocationsManager = new LocationsManager(this);
    /** A helper object for managing all players and their respective states in the session. */
    public readonly players: PlayersManager = new PlayersManager(this);
    /** A helper object for managing room state information. */
    public readonly room: RoomManager = new RoomManager(this);
    /** A helper object for communicating directly with the AP network protocol. */
    public readonly api: APIManager = new APIManager(this.#events, this.#send.bind(this));

    /** The name of the game associated with this client. */
    public get game(): string {
        return this.#game;
    }

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

    /** Returns the slot name of this client. */
    public get name(): string {
        return this.#name;
    }

    /** Returns the connection arguments for this client. */
    public get args(): ConnectionArguments {
        return this.#args;
    }

    /**
     * Connect to an Archipelago server without authenticating.
     * @param url The url of the server, including the protocol (e.g., `wss://archipelago.gg:38281`).
     * @param timeout Max number of milliseconds to wait for server to attempt to establish connection, before failing.
     * @remarks If the port is omitted, client will default to `38281`.
     *
     * Any paths, queries, fragments, or userinfo components of the provided `url` will be ignored.
     */
    public async connect(url: URL | string, timeout: number = 10_000): Promise<void> {
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
                    const timeoutInstance = setTimeout(() => {
                        unsubscribe();
                        reject(new APSocketError(
                            "Client did not receive RoomInfo packet within 10 seconds of establishing connection. "
                            + "Is this an Archipelago server?",
                        ));
                    }, timeout);
                    const unsubscribe = this.api.subscribe("onRoomInfo", () => {
                        clearTimeout(timeoutInstance);
                        unsubscribe();
                        resolve();
                    });
                };
                this.#socket.onerror = () => {
                    reject(new APSocketError("Socket closed unexpectedly. Is there a server listening on that URL?"));
                };
                this.#socket.onmessage = (event: MessageEvent<string>) => {
                    const packets = JSON.parse(event.data) as ServerPacket[];
                    this.#events
                        .dispatchEvent(new CustomEvent<ServerPacket[]>("__onPacketsReceived", { detail: packets }));
                };
            });
        } catch (error) {
            this.disconnect();
            throw error;
        }
    }

    /**
     * Attempt to connect to an Archipelago server and authenticate to the session.
     * @param name The slot name to connect to.
     * @param game The game name associated with the connecting slot.
     * @param options An object of optional properties to configure the connection.
     */
    public async authenticate(name: string, game: string, options: ConnectionArguments = {}): Promise<void> {
        if (!this.connected) {
            throw new APSocketError("Cannot authenticate until connected to server.");
        }

        if (name === "") {
            throw Error("The slot name cannot be blank.");
        }

        const defaultOptions = createDefaultConnectionArgs();
        const password = options.password ?? defaultOptions.password;
        const uuid = options.uuid ?? defaultOptions.uuid;
        const tags = new Set(options.tags ?? defaultOptions.tags);
        const version = options.targetVersion ?? defaultOptions.targetVersion;
        const slotData = options.requestSlotData ?? defaultOptions.requestSlotData;
        const subscribedItemEvents: string = options.subscribedItemEvents ?? defaultOptions.subscribedItemEvents;
        // Validate version.
        if (
            !Number.isSafeInteger(version.major)
            || !Number.isSafeInteger(version.minor)
            || !Number.isSafeInteger(version.build)
            || version.major < 0
            || version.minor < 0
            || version.build < 0
        ) {
            throw RangeError("Each component of `targetVersion` must be a non-negative safe integer.");
        }

        // Tag shortcuts.
        if (options.isHintClient) {
            tags.add(CommonTags.HINT_GAME);
        } else if (options.isTracker) {
            tags.add(CommonTags.TRACKER);
        } else if (options.isTextOnly) {
            tags.add(CommonTags.TEXT_ONLY);
        }

        // Items handling shorthands.
        let itemsHandling: number = ItemsHandlingFlags.REMOTE_MINIMAL;
        switch (subscribedItemEvents) {
            case "all":
                itemsHandling = ItemsHandlingFlags.REMOTE_ALL;
                break;
            case "exclude_self":
                itemsHandling = ItemsHandlingFlags.REMOTE_DIFFERENT_WORLDS & ItemsHandlingFlags.REMOTE_STARTING_INVENTORY;
                break;
            case "exclude_starting_inventory":
                itemsHandling = ItemsHandlingFlags.REMOTE_DIFFERENT_WORLDS & ItemsHandlingFlags.REMOTE_OWN_WORLD;
                break;
            case "external_only":
                itemsHandling = ItemsHandlingFlags.REMOTE_DIFFERENT_WORLDS;
                break;
            case "minimal":
                itemsHandling = ItemsHandlingFlags.REMOTE_MINIMAL;
                break;
            default:
                throw new Error(`Unknown \`subscribedItemEvents\` value: ${subscribedItemEvents}`);
        }

        const connectPacket: ConnectPacket = {
            cmd: "Connect",
            game,
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
            const unsubConnect = this.api.subscribe("onConnected", () => {
                unsubConnect();
                unsubRefused();

                // Set state values.
                this.#args = { ...defaultOptions, ...options };
                this.#name = name;
                this.#game = game;

                resolve(); // TODO: Should return self-player information.
            });
            const unsubRefused = this.api.subscribe("onConnectionRefused", (packet) => {
                unsubConnect();
                unsubRefused();
                reject(new Error(`Connection was refused. Reason(s): [${packet.errors?.join(", ")}]`));
            });

            this.api.send(connectPacket);
        });
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
     * Update the client status for the current player. For a list of known client statuses, see {@link ClientStatus}.
     * @param status The status to change to.
     * @remarks Once a player has reached the {@link ClientStatus.Goal} status, it cannot be changed and any additional
     * requests will be ignored by the server.
     */
    public updateStatus(status: ClientStatus) {
        this.api.send({ cmd: "StatusUpdate", status });
    }

    #send(packets: ClientPacket[]): void {
        if (!this.#socket) {
            throw new APSocketError("Unable to send packet(s); not connected to a server.");
        }

        this.#socket.send(JSON.stringify(packets));
    }
}