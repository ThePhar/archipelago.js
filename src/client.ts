import { clientStatuses, ConnectedPacket, ConnectionRefusedPacket, ConnectPacket, JSONSerializableData } from "./api";
import * as Managers from "./managers";
import { ClientStatus } from "./managers";
import { ClientOptions, ConnectionOptions, defaultClientOptions, defaultConnectionOptions } from "./options.ts";

/** An abstract type for unknown slot data. */
export type UnknownSlotData = { [p: string]: JSONSerializableData };

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
    public readonly socket = new Managers.SocketManager(this);
    /** A helper object for handling game data packages. */
    public readonly package = new Managers.DataPackageManager(this);
    /** A helper object for handling the data storage API. */
    public readonly storage = new Managers.DataStorageManager(this);
    /** A helper object for handling room state. */
    public readonly room = new Managers.RoomStateManager(this);
    /** A helper object for handling players (including self). */
    public readonly players = new Managers.PlayersManager(this);
    /** A helper object for handling chat messages. */
    public readonly message = new Managers.MessageManager(this);

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
        this.socket.on("disconnected", () => {
            this.#authenticated = false;
        });
    }

    /**
     * Connect and authenticate to an Archipelago server.
     * @param url The url of the server, including the protocol (e.g., `wss://archipelago.gg:38281`).
     * @param name The slot name this client will be connecting to.
     * @param game The game name this client will be connecting to.
     * @param options Additional optional connection arguments.
     * @typeParam SlotData If slot data is requested, this sets the type of the returning slot data.
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
     * await client.login("wss://archipelago.gg:38281", "Phar", "Clique", {
     *     slotData: false,
     *     password: "4444"
     * });
     * @example <caption>TypeScript with Slot Data</caption>
     * import { Client } from "archipelago.js";
     *
     * interface CliqueSlotData {
     *     color: string
     *     hard_mode: boolean
     * }
     *
     * const client = new Client();
     *
     * // slotData: CliqueSlotData { color: "red", hard_mode: false }
     * const slotData = await client.login<CliqueSlotData>("wss://archipelago.gg:38281", "Phar", "Clique");
     */
    public async login<SlotData extends UnknownSlotData>(
        url: URL | string,
        name: string,
        game: string,
        options?: ConnectionOptions,
    ): Promise<SlotData> {
        if (name === "") {
            throw Error("Provided slot name cannot be blank.");
        }

        if (options) {
            this.#arguments = { ...defaultConnectionOptions, ...options };
        } else {
            this.#arguments = { ...defaultConnectionOptions };
        }

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
        const data = new Promise<SlotData>((resolve, reject) => {
            const timeout = setTimeout(
                // TODO: Replace with custom error object that can export the reasons easier.
                () => reject(new Error("Server has not responded in time.")),
                this.options.timeout,
            );

            const connectedHandler = (packet: ConnectedPacket) => {
                this.#authenticated = true;
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
                reject(new Error(`Connection was refused. Reason(s): [${packet.errors?.join(", ")}`));
            };

            this.socket
                .on("connected", connectedHandler.bind(this))
                .on("connectionRefused", refusedHandler.bind(this))
                .send(request);
        });

        // Automatically load data package if requested.
        if (this.options.autoFetchDataPackage) {
            await this.package.fetchPackage();
        }

        return data;
    }

    /**
     * Set or clear the alias for the currently connected player.
     * @param alias The alias to be set. If omitted, will clear alias instead.
     * @returns A promise that resolves when the server acknowledges the change.
     * @remarks Technically, there is no API-native way to change alias, this basically just sends a `!alias [name]`
     * message to emulate the behavior.
     */
    public async setAlias(alias: string = ""): Promise<void> {
        return this.message.chat(`!alias ${alias}`);
    }

    /**
     * Update the client status for the current player. For a list of known client statuses, see {@link clientStatuses}.
     * @param status The status to change to.
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
        this.socket.send({ cmd: "StatusUpdate", status });
    }

    /**
     * A shorthand for running `Client.updateStatus(clientStatuses.goal)`. Once set, cannot be changed and if release
     * and/or collect is set to automatic, will release/collect all items.
     */
    public goal(): void {
        this.updateStatus(clientStatuses.goal);
    }
}
