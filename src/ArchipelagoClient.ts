import { ClientPacketType } from "./api";
import { ConnectionStatus } from "./enums/ConnectionStatus";
import { SocketManager } from "./managers/SocketManager";
import { APEventEmitter } from "./utils/APEventEmitter";

/**
 * The client that connects to an Archipelago server and facilitates communication, listens for events, and managers
 * data.
 */
export class ArchipelagoClient {
    #events: APEventEmitter = new APEventEmitter();

    /**
     * Manages the web socket and API-level communication.
     * @remarks Library subscribers should use the abstracted helper functions/structs instead of interacting with the
     * api or socket directly, but it is exposed if necessary.
     */
    public readonly socket: SocketManager = new SocketManager(this.#events);

    /**
     * Send a chat message to the server.
     * @param message The message content to broadcast.
     * @throws Error If not connected and authenticated to an Archipelago server.
     */
    public say(message: string): void {
        if (this.socket.status !== ConnectionStatus.Connected) {
            throw new Error("Cannot send chat messages while not connected and authenticated to server.");
        }

        this.socket.send({ cmd: ClientPacketType.Say, text: message.trim() });
    }
}
