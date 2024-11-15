import { clientStatuses, ConnectedPacket, ConnectionRefusedPacket, ConnectPacket, JSONRecord } from "../api";
import { ArgumentError, LoginError, SocketError, UnauthenticatedError } from "../errors.ts";
import { ClientOptions, defaultClientOptions } from "../interfaces/ClientOptions.ts";
import { ConnectionOptions, defaultConnectionOptions } from "../interfaces/ConnectionOptions.ts";
import { Item } from "./Item.ts";
import { DataPackageManager } from "./managers/DataPackageManager.ts";
import { DataStorageManager } from "./managers/DataStorageManager.ts";
import { DeathLinkManager } from "./managers/DeathLinkManager.ts";
import { ItemsManager } from "./managers/ItemsManager.ts";
import { MessageManager } from "./managers/MessageManager.ts";
import { ClientStatus, PlayersManager } from "./managers/PlayersManager.ts";
import { RoomStateManager } from "./managers/RoomStateManager.ts";
import { SocketManager } from "./managers/SocketManager.ts";
import { Player } from "./Player.ts";

/**
 * The client that connects to an Archipelago server and provides helper methods and objects to facilitate
 * communication, listen for events, and manage data.
 */
export class Client {
    #authenticated: boolean = false;
    #arguments: Required<ConnectionOptions> = defaultConnectionOptions;
    #name: string = "";
    #game: string = "";

    /** A helper object for handling websocket communication and AP network protocol. */
    public readonly socket = new SocketManager();
    /** A helper object for handling game data packages. */
    public readonly package = new DataPackageManager(this);
    /** A helper object for handling the data storage API. */
    public readonly storage = new DataStorageManager(this);
    /** A helper object for handling room state. */
    public readonly room = new RoomStateManager(this);
    /** A helper object for handling players (including self). */
    public readonly players = new PlayersManager(this);
    /** A helper object for handling received items and hints. */
    public readonly items = new ItemsManager(this);
    /** A helper object for handling chat messages. */
    public readonly messages = new MessageManager(this);
    /** A helper object for handling DeathLink mechanics. */
    public readonly deathLink = new DeathLinkManager(this);

    /** Current options for this client. */
    public options: Required<ClientOptions>;

    /** Returns `true` if currently connected and authenticated to the Archipelago server. */
    public get authenticated(): boolean {
        return this.socket.connected && this.#authenticated;
    }

    /** Returns the client's current slot name (or an empty string, if never connected). */
    public get name(): string {
        return this.#name;
    }

    /** Returns the client's current game name (or an empty string, if never connected). */
    public get game(): string {
        return this.#game;
    }

    /** Returns a copy of this client's current connection arguments (or defaults, if never connected). */
    public get arguments(): Required<ConnectionOptions> {
        return { ...this.#arguments };
    }

    /**
     * Instantiates a new Archipelago client. After creating, call {@link Client.login} to connect and authenticate to
     * a server.
     * @param options Additional configuration options for this client. See {@link ClientOptions} for more information.
     */
    public constructor(options?: ClientOptions) {
        if (options) {
            this.options = { ...defaultClientOptions, ...options };
        } else {
            this.options = { ...defaultClientOptions };
        }

        // Setup disconnection event handler to reset internal state.
        this.socket
            .on("disconnected", () => {
                this.#authenticated = false;
            })
            .on("sentPackets", (packets) => {
                for (const packet of packets) {
                    if (packet.cmd === "ConnectUpdate") {
                        this.#arguments.tags = packet.tags;
                        this.#arguments.items = packet.items_handling;
                    }
                }
            });
    }

    /**
     * Connect and authenticate to an Archipelago server.
     * @template SlotData If slot data is requested, this sets the type of the returning slot data.
     * @param url The url of the server, including the protocol (e.g., `wss://archipelago.gg:38281`).
     * @param name The slot name this client will be connecting to.
     * @param game The game name this client will be connecting to. If omitted, client will connect in "TextOnly" mode.
     * @param options Additional optional connection arguments.
     * @throws {@link ArgumentError} if slot name is empty.
     * @throws {@link LoginError} if the server refuses the authentication attempt.
     * @throws {@link TypeError} if provided URL is malformed or invalid protocol.
     * @remarks If the port is omitted, the client will default to `38281` (AP default).
     *
     * If the protocol is omitted, client will attempt to connect via wss, then fallback to ws if unsuccessful.
     *
     * Any paths, queries, fragments, or userinfo components of the provided url will be ignored.
     * @example <caption>Password Required and No Slot Data</caption>
     * import { Client } from "archipelago.js";
     *
     * const client = new Client();
     *
     * await client.login("archipelago.gg:38281", "Phar", "Clique", {
     *     slotData: false,
     *     password: "4444"
     * });
     * @example <caption>TypeScript with Slot Data</caption>
     * import { Client } from "archipelago.js";
     *
     * type CliqueSlotData = {
     *     color: string
     *     hard_mode: boolean
     * }
     *
     * const client = new Client();
     *
     * // slotData: CliqueSlotData { color: "red", hard_mode: false }
     * const slotData = await client.login<CliqueSlotData>("archipelago.gg:38281", "Phar", "Clique");
     */
    public async login<SlotData extends JSONRecord>(
        url: URL | string,
        name: string,
        game: string = "",
        options?: ConnectionOptions,
    ): Promise<SlotData> {
        if (name === "") {
            throw new ArgumentError("Provided slot name cannot be blank.", "name", name);
        }

        if (options) {
            this.#arguments = { ...defaultConnectionOptions, ...options };
        } else {
            this.#arguments = { ...defaultConnectionOptions };
        }

        // Enforce TextOnly if no game was provided (and no relevant tag was supplied).
        const tags = new Set(this.arguments.tags);
        if (!game && !tags.has("HintGame") && !tags.has("Tracker") && !tags.has("TextOnly")) {
            tags.add("TextOnly");
        }

        // Removes duplicate tags.
        this.#arguments.tags = Array.from(tags);
        const request: ConnectPacket = {
            cmd: "Connect",
            name,
            game,
            password: this.arguments.password,
            slot_data: this.arguments.slotData,
            items_handling: this.arguments.items,
            uuid: this.arguments.uuid,
            tags: this.arguments.tags,
            version: { ...this.arguments.version, class: "Version" },
        };

        await this.socket.connect(url);

        // Automatically load data package if requested, prior to connection to prefill data package.
        if (this.options.autoFetchDataPackage) {
            await this.package.fetchPackage();
        }

        return new Promise<SlotData>((resolve, reject) => {
            const timeout = setTimeout(
                () => reject(new SocketError("Server failed to respond in time.")),
                this.options.timeout,
            );

            const connectedHandler = (packet: ConnectedPacket) => {
                this.#authenticated = true;
                this.#game = packet.slot_info[packet.slot].game;
                this.#name = packet.slot_info[packet.slot].name;
                this.socket
                    .off("connected", connectedHandler)
                    .off("connectionRefused", refusedHandler);

                clearTimeout(timeout);
                resolve(packet.slot_data as SlotData);
            };

            const refusedHandler = (packet: ConnectionRefusedPacket) => {
                this.socket
                    .off("connected", connectedHandler)
                    .off("connectionRefused", refusedHandler);

                // TODO: Replace with custom error object that can export the reasons easier.
                clearTimeout(timeout);
                reject(new LoginError(
                    `Connection was refused by the server. Reason(s): [${packet.errors?.join(", ")}`,
                    packet.errors ?? [],
                ));
            };

            this.socket
                .on("connected", connectedHandler.bind(this))
                .on("connectionRefused", refusedHandler.bind(this))
                .send(request);
        });
    }

    /**
     * Update the client status for the current player. For a list of known client statuses, see {@link clientStatuses}.
     * @param status The status to change to.
     * @throws {@link UnauthenticatedError} if not connected and authenticated.
     * @remarks The server will automatically set the player's status to {@link clientStatuses.disconnected} when all
     * clients connected to this slot have disconnected, set the status to {@link clientStatuses.connected} if a client
     * connects to this slot when previously set to {@link clientStatuses.disconnected}, or ignores any future updates
     * if ever set to {@link clientStatuses.goal}.
     * @example
     * import { Client, clientStatuses } from "archipelago.js";
     *
     * const client = new Client();
     * await client.login("wss://archipelago.gg:38281", "Phar", "Clique");
     *
     * // Mark client as ready to start.
     * client.updateStatus(clientStatuses.ready);
     */
    public updateStatus(status: ClientStatus): void {
        if (!this.authenticated) {
            throw new UnauthenticatedError("Cannot update status while not connected and authenticated.");
        }

        this.socket.send({ cmd: "StatusUpdate", status });
    }

    /**
     * A shorthand for running `Client.updateStatus(clientStatuses.goal)`. Once set, cannot be changed and if release
     * and/or collect is set to automatic, will release/collect all items.
     * @throws {@link UnauthenticatedError} if not connected and authenticated.
     */
    public goal(): void {
        this.updateStatus(clientStatuses.goal);
    }

    /**
     * Request the server update this client's tags.
     * @param tags Tags to replace the current ones.
     * @throws {@link UnauthenticatedError} if not connected and authenticated.
     */
    public updateTags(tags: string[]): void {
        if (!this.authenticated) {
            throw new UnauthenticatedError("Cannot update tags while not connected and authenticated.");
        }

        this.socket.send({ cmd: "ConnectUpdate", tags, items_handling: this.arguments.items });
    }

    /**
     * Request the server update the kinds of item received events this client should receive.
     * @param items New item handling flags.
     * @throws {@link UnauthenticatedError} if not connected and authenticated.
     */
    public updateItemsHandling(items: number): void {
        if (!this.authenticated) {
            throw new UnauthenticatedError("Cannot update tags while not connected and authenticated.");
        }

        this.socket.send({ cmd: "ConnectUpdate", tags: this.arguments.tags, items_handling: items });
    }

    /**
     * Marks a list of locations as checked on the server.
     * @param locations Location ids to check.
     * @throws {@link UnauthenticatedError} if attempting to check locations while not authenticated.
     * @remarks Locations that do not exist or have already been checked in the multi-world are ignored.
     */
    public check(...locations: number[]): void {
        if (!this.authenticated) {
            throw new UnauthenticatedError("Cannot check locations while not connected and authenticated.");
        }

        // Only allow checking missing locations.
        locations = locations.filter((location) => this.room.missingLocations.includes(location));
        this.socket.send({ cmd: "LocationChecks", locations });
    }

    /**
     * Scout a list of locations for their containing items.
     * @param locations A list of location ids to scout.
     * @param createHint Whether to create hints for these locations.
     *
     * - If set to `0`, this packet will not create hints for any locations in this packet.
     * - If set to `1`, this packet will create hints for all locations in this packet and broadcast them to all
     * relevant clients.
     * - If set to `2`, this packet will create hints for all locations in this packet and broadcast only new hints to
     * all relevant clients.
     * @throws {@link UnauthenticatedError} if attempting to scout locations while not authenticated.
     */
    public async scout(locations: number[], createHint: 0 | 1 | 2 = 0): Promise<Item[]> {
        if (!this.authenticated) {
            throw new UnauthenticatedError("Cannot scout locations while not connected and authenticated.");
        }

        // Only allow scouting existing locations.
        locations = locations.filter((location) => this.room.allLocations.includes(location));
        const [response] = await this.socket
            .send({ cmd: "LocationScouts", create_as_hint: createHint, locations })
            .wait("locationInfo", (packet) => {
                // Easy way to check if both lists are identical.
                return packet.locations.map((location) => location.location).toSorted().join(",") === locations.toSorted().join(",");
            });

        return response.locations.map((item) => new Item(
            this,
            item,
            this.players.self,
            this.players.findPlayer(item.player) as Player),
        );
    }

    /**
     * Send a bounce packet targeting any clients that fulfil any target parameters. Can be listened for by listening to
     * "bounced" events on {@link SocketManager}.
     * @param targets The targets to receive this bounce packet.
     * @param targets.games Specific games that should receive this bounce.
     * @param targets.slots Specific slots that should receive this bounce.
     * @param targets.tags Specific clients with these tags that should receive this bounce.
     * @param data The json-serializable data to send.
     * @throws {@link UnauthenticatedError} if attempting to send a bounce while not authenticated.
     * @remarks If no targets are specified, no clients will receive this bounce packet.
     */
    public bounce(targets: { games?: string[], slots?: number[], tags?: string[] }, data: JSONRecord): void {
        if (!this.authenticated) {
            throw new UnauthenticatedError("Cannot send bounces while not connected and authenticated.");
        }

        this.socket.send({
            cmd: "Bounce",
            data,
            games: targets.games ?? [],
            slots: targets.slots ?? [],
            tags: targets.tags ?? [],
        });
    }
}
