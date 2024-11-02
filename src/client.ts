import { ConnectedPacket, ConnectionRefusedPacket, ConnectPacket } from "./api";
import { SocketManager } from "./managers/socket.ts";
import { parseVersion } from "./utils.ts";

/**
 * The client that connects to an Archipelago server and provides helper methods and objects to facilitate
 * communication, listen for events, and manage data.
 */
export class Client {
    #authenticated: boolean = false;

    /** A helper object for handling websocket communication and interacting with the AP network protocol directly. */
    public readonly socket: SocketManager = new SocketManager(this);

    /** Returns `true` if currently connected and authenticated to the Archipelago server. */
    public get authenticated(): boolean {
        return this.socket.connected && this.#authenticated;
    }

    /**
     * Instantiates a new Archipelago client. After creating, call {@link Client.login} to connect and authenticate to
     * a server.
     */
    public constructor() {
        // Setup disconnection event handler to reset internal state.
        this.socket.on("Disconnect", () => {
            this.#authenticated = false;
        });
    }

    /**
     * Connect and authenticate to an Archipelago server.
     * @param url The url of the server, including the protocol (e.g., `wss://archipelago.gg:38281`).
     * @param name The slot name this client will be connecting to.
     * @param game The game name this client will be connecting to.
     * @remarks If the port is omitted, the client will default to `38281` (AP default).
     *
     * If the protocol is omitted, client will attempt to connect via wss, then fallback to ws if unsuccessful.
     *
     * Any paths, queries, fragments, or userinfo components of the provided url will be ignored.
     * @example
     * import { Client } from "archipelago.js";
     *
     * // Instantiate a new client.
     * const client = new Client();
     *
     * // Connect and authenticate.
     * await client.login("wss://archipelago.gg:42069", "Phar", "Clique");
     */
    public async login(url: URL | string, name: string, game: string): Promise<void> {
        if (name === "") {
            throw Error("Provided slot name cannot be blank.");
        }

        // TODO: Write additional options.
        const password = "";
        const uuid = "";
        const tags: string[] = [];
        const version = parseVersion("0.5.0");
        const items = 7;
        const packet: ConnectPacket = {
            cmd: "Connect",
            name,
            game,
            password,
            slot_data: false,
            items_handling: items,
            uuid,
            version,
            tags,
        };

        await this.socket.connect(url);
        return new Promise((resolve, reject) => {
            const connectedHandler = (packet: ConnectedPacket) => {
                this.socket
                    .off("Connected", connectedHandler)
                    .off("ConnectionRefused", refusedHandler);

                console.log(`Connected to archipelago server as slot #${packet.slot}.`);
                resolve();
            };

            const refusedHandler = (packet: ConnectionRefusedPacket) => {
                this.socket
                    .off("Connected", connectedHandler)
                    .off("ConnectionRefused", refusedHandler);

                // TODO: Replace with custom error object that can export the reasons easier.
                reject(new Error(`Connection was refused. Reason(s): [${packet.errors?.join(", ")}`));
            };

            this.socket
                .on("Connected", connectedHandler.bind(this))
                .on("ConnectionRefused", refusedHandler.bind(this))
                .send(packet);
        });
    }
}
