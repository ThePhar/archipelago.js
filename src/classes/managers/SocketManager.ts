import { ClientPacket, RoomInfoPacket, ServerPacket } from "../../api";
import { SocketError } from "../../errors.ts";
import { SocketEvents } from "../../events/SocketEvents.ts";
import { EventBasedManager } from "./EventBasedManager.ts";

/**
 * Manages socket-level communication and exposes helper methods/events for interacting with the Archipelago API
 * directly.
 */
export class SocketManager extends EventBasedManager<SocketEvents> {
    #socket: WebSocket | null = null;
    #connected: boolean = false;

    /**
     * Instantiates a new SocketManager. Should only be instantiated by creating a new {@link Client}.
     * @internal
     */
    public constructor() {
        super();
    }

    /** Returns `true` if currently connected to a websocket server. */
    public get connected(): boolean {
        return this.#connected;
    }

    /** Returns the current connection's URL or an empty string, if not connected. */
    public get url(): string {
        return this.#socket?.url ?? "";
    }

    /**
     * Send a list of raw client packets to the server.
     * @param packets List of client packets to send.
     * @returns This SocketManager.
     * @throws SocketError if not connected to a server.
     */
    public send(...packets: ClientPacket[]): SocketManager {
        if (this.#socket) {
            this.#socket.send(JSON.stringify(packets));
            this.emit("sentPackets", [packets]);
            return this;
        }

        throw new SocketError("Unable to send packets to the server; not connected to a server.");
    }

    /**
     * Establish a connection to an Archipelago server before authenticating; useful if there might be tasked that are
     * needed to be performed before authenticating, but after connecting (e.g., DataPackage).
     * @param url The url of the server, including the protocol (e.g., `wss://archipelago.gg:38281`).
     * @returns The {@link RoomInfoPacket} received on initial connection.
     * @throws SocketError If failed to connect or no websocket API is available.
     * @throws TypeError If provided URL is malformed or invalid protocol.
     * @remarks If the port is omitted, client will default to `38281`.
     *
     * If the protocol is omitted, client will attempt to connect via `wss`, then fallback to `ws` if unsuccessful.
     */
    public async connect(url: URL | string): Promise<RoomInfoPacket> {
        // Drop any current connection prior to connecting.
        this.disconnect();

        if (typeof url === "string") {
            // Check if protocol was provided and URL is valid-ish, if not we'll add wss and fallback to ws if it fails.
            const pattern = /^([a-zA-Z]+:)\/\/[A-Za-z0-9_.~\-:]+/i;
            if (!pattern.test(url)) {
                try {
                    // First try "wss".
                    return await this.connect(new URL(`wss://${url}`));
                } catch {
                    // Nope, try "ws".
                    return await this.connect(new URL(`ws://${url}`));
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
                const IsomorphousWebSocket = this.#findWebSocket();
                if (IsomorphousWebSocket === null) {
                    throw new SocketError("Unable to find a suitable WebSocket API in the current runtime.");
                }

                // Establish a websocket connection and setup basic handlers.
                this.#socket = new IsomorphousWebSocket(url);
                this.#socket.onmessage = this.#parseMessage.bind(this);
                this.#socket.onclose = () => {
                    this.disconnect();
                    reject(new SocketError("Failed to connect to Archipelago server."));
                };
                this.#socket.onerror = () => {
                    this.disconnect();
                    reject(new SocketError("Failed to connect to Archipelago server."));
                };
                this.#socket.onopen = () => {
                    this.wait("roomInfo")
                        .then(([packet]) => {
                            this.#connected = true;

                            // Reassign onclose and onerror now that connection looks stable.
                            if (this.#socket) {
                                this.#socket.onclose = this.disconnect.bind(this);
                                this.#socket.onerror = this.disconnect.bind(this);
                                resolve(packet);
                                return;
                            }

                            // Lost socket after connecting somehow? Should never happen, hopefully.
                            this.disconnect();
                            reject(new SocketError("Failed to connect to Archipelago server."));
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
        this.emit("disconnected", []);
    }

    #parseMessage(event: MessageEvent<string>): void {
        const packets = JSON.parse(event.data) as ServerPacket[];
        for (const packet of packets) {
            switch (packet.cmd) {
                case "ConnectionRefused":
                    this.emit("connectionRefused", [packet]);
                    break;
                case "Bounced":
                    this.emit("bounced", [packet, packet.data]);
                    break;
                case "Connected":
                    this.emit("connected", [packet]);
                    break;
                case "DataPackage":
                    this.emit("dataPackage", [packet]);
                    break;
                case "InvalidPacket":
                    this.emit("invalidPacket", [packet]);
                    break;
                case "LocationInfo":
                    this.emit("locationInfo", [packet]);
                    break;
                case "PrintJSON":
                    this.emit("printJSON", [packet]);
                    break;
                case "ReceivedItems":
                    this.emit("receivedItems", [packet]);
                    break;
                case "Retrieved":
                    this.emit("retrieved", [packet]);
                    break;
                case "RoomInfo":
                    this.emit("roomInfo", [packet]);
                    break;
                case "RoomUpdate":
                    this.emit("roomUpdate", [packet]);
                    break;
                case "SetReply":
                    this.emit("setReply", [packet]);
                    break;
            }

            // Generic-packet listeners only fire after all specific-packet listeners have fired.
            this.emit("receivedPacket", [packet]);
        }
    }

    #findWebSocket(): typeof WebSocket | null {
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
}
