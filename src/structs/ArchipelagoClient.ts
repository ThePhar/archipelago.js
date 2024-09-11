import { ClientStatus, ItemsHandlingFlags, JSONSerializableData } from "../api";
import { ClientPacket, ConnectPacket, ServerPacket } from "../api/packets";
import { CommonTags } from "../consts/CommonTags.ts";
import { APSocketError } from "../errors.ts";
import { APIManager } from "../managers/APIManager.ts";
import { DataPackageManager } from "../managers/DataPackageManager.ts";
import { DataStorageManager } from "../managers/DataStorageManager.ts";
import { ItemsManager } from "../managers/ItemsManager.ts";
import { LocationsManager } from "../managers/LocationsManager.ts";
import { PlayerMetadata, PlayersManager } from "../managers/PlayersManager.ts";
import { RoomManager } from "../managers/RoomManager.ts";
import { ConnectionArguments } from "../types/ConnectionArguments.ts";
import { createDefaultConnectionArgs, findWebSocket } from "../utils.ts";

/**
 * The client that connects to an Archipelago server, facilitates communication, and keeps track of room/player state.
 */
export class ArchipelagoClient {
    readonly #events: EventTarget = new EventTarget();
    #socket: WebSocket | null = null;
    #connected: boolean = false;
    #args: Required<ConnectionArguments> = createDefaultConnectionArgs();
    #name: string = "";
    #game: string = "";
    #slot: number = -1;
    #team: number = -1;

    /** A helper object for communicating directly with the AP network protocol. */
    public readonly api: APIManager = new APIManager(this.#events, this.#send.bind(this));
    /** A helper object for managing room state information. */
    public readonly room: RoomManager = new RoomManager(this);
    /** A helper object for tracking and communciating to/from the AP data storage and data package. */
    public readonly data: DataStorageManager = new DataStorageManager(this);
    /** A helper object for managing data package and provides helper functions for name lookups. */
    public readonly package: DataPackageManager = new DataPackageManager(this);
    /** A helper object for tracking received items in the session. */
    public readonly items: ItemsManager = new ItemsManager(this);
    /** A helper object for tracking, scouting, and checking locations in the session. */
    public readonly locations: LocationsManager = new LocationsManager(this);
    /** A helper object for managing all players and their respective states in the session. */
    public readonly players: PlayersManager = new PlayersManager(this);

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

    /** Returns this client's team number. */
    public get team(): number {
        return this.#team;
    }

    /** Return this client's slot number. */
    public get slot(): number {
        return this.#slot;
    }

    /** Return this client's {@link PlayerMetadata}. */
    public get player(): PlayerMetadata {
        const player = this.players.findPlayer(this.team, this.slot);
        if (player) {
            return player;
        }

        throw new Error("Cannot to pull player information prior to first connection. Please connect first.");
    }

    /**
     * Fetch this client's slot data from local cache, if available. Otherwise, via the network.
     * @template T The type of the slot data that is returned, for better typing information.
     */
    public async fetchSlotData<T extends { [p: string]: JSONSerializableData }>(): Promise<T> {
        return this.player.fetchSlotData<T>();
    }

    /**
     * Connect and authenticate to an Archipelago server.
     * @param url The url of the server, including the protocol (e.g., `wss://archipelago.gg:38281`).
     * @param name The name of the slot to connect to.
     * @param game The name of the game associated with the slot being connected to.
     * @param options A collection of options that can be configured
     * @remarks If the port is omitted, client will default to `38281`.
     *
     * Any paths, queries, fragments, or userinfo components of the provided `url` will be ignored.
     * @example
     * import { ArchipelagoClient } from "@pharware/archipelago";
     *
     * const client = new ArchipelagoClient();
     * await client.connect("wss://archipelago.gg:38281", "Phar", "Clique");
     */
    public async connect(url: URL | string, name: string, game: string, options: ConnectionArguments = {}): Promise<void> {
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

                    const unsubscribe = this.api.subscribe("onRoomInfo", () => {
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

            await this.#authenticate(name, game, options);
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
     * Update the client status for the current player. For a list of known client statuses, see {@link ClientStatus}.
     * @param status The status to change to.
     * @example
     * import { ArchipelagoClient } from "@pharware/archipelago";
     *
     * const client = new ArchipelagoClient();
     * await client.connect("wss://archipelago.gg:38281", "Phar", "Clique");
     *
     * // Mark client as ready to start.
     * client.updateStatus(10);
     */
    public updateStatus(status: ClientStatus): void {
        this.api.send({ cmd: "StatusUpdate", status });
    }

    /**
     * Sends goal completion and sets client status appropriately.
     * @example
     * client.sendGoalCompletion();
     *
     * // AP: Phar (Team #1) has completed their goal.
     */
    public sendGoalCompletion(): void {
        this.updateStatus(ClientStatus.Goal);
    }

    /**
     * Set or clear the alias for the currently connected player.
     * @param alias The alias to be set. If omitted, will clear alias instead.
     */
    public setAlias(alias: string = "") {
        this.say(`!alias ${alias}`);
    }

    public say(message: string): void {
        this.api.send({ cmd: "Say", text: message.trim() });
    }

    #send(packets: ClientPacket[]): void {
        if (!this.#socket) {
            throw new APSocketError("Unable to send packet(s); not connected to a server.");
        }

        this.#socket.send(JSON.stringify(packets));
    }

    async #authenticate(name: string, game: string, options: ConnectionArguments = {}): Promise<void> {
        if (name === "") {
            throw Error("The slot name cannot be blank.");
        }

        const defaultOptions = createDefaultConnectionArgs();
        const password = options.password ?? defaultOptions.password;
        const uuid = options.uuid ?? defaultOptions.uuid;
        const tags = new Set(options.tags ?? defaultOptions.tags);
        const version = options.targetVersion ?? defaultOptions.targetVersion;
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

        if (options.fetchDataPackage ?? defaultOptions.fetchDataPackage) {
            await this.package.fetch();
        }

        const connectPacket: ConnectPacket = {
            cmd: "Connect",
            game,
            name,
            password,
            slot_data: false,
            items_handling: itemsHandling,
            tags: Array.from(tags),
            uuid,
            version: { ...version, class: "Version" },
        };

        await new Promise<void>((resolve, reject) => {
            // Setup event handlers.
            const unsubConnect = this.api.subscribe("onConnected", (packet) => {
                unsubConnect();
                unsubRefused();

                // Set state values.
                this.#args = { ...defaultOptions, ...options };
                this.#name = name;
                this.#game = game;
                this.#slot = packet.slot;
                this.#team = packet.team;

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
}
