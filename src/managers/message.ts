import { PrintJSONPacket, SayPacket } from "../api";
import { Client } from "../client.ts";
import { EventBasedManager } from "./abstract.ts";

/**
 * Manages and stores {@link PrintJSONPacket} messages and interacting with the chat system.
 */
export class MessageManager extends EventBasedManager<MessageEvents> {
    readonly #client: Client;
    readonly #messages: { message: string, packet: PrintJSONPacket }[] = [];

    /**
     * Returns all current chat messages that are logged.
     *
     * If the messages length is greater than {@link ClientOptions.maximumMessages}, the oldest messages are spliced
     * out.
     */
    public get messages(): { readonly message: string, readonly packet: PrintJSONPacket }[] {
        return this.#messages;
    }

    /**
     * Instantiates a new MessageManager. Should only be instantiated by creating a new {@link Client}.
     * @internal
     * @param client The client object this manager is associated with.
     */
    public constructor(client: Client) {
        super(client);
        this.#client = client;

        // Log messages and emit events.
        this.#client.socket.on("PrintJSON", (packet, message) => {
            let index = -1;
            if (this.#client.options.maximumMessages >= 1) {
                this.messages.push({ message, packet });
                this.messages.splice(0, this.messages.length - this.#client.options.maximumMessages);
                index = this.messages.length - 1;
            }

            this.emit("ReceivedMessage", [message, index, packet]);
        });
    }

    /**
     * Sends a chat message to the server.
     * @param text The textual message to broadcast to all connected clients.
     * @returns A promise that resolves when the server responds with the PrintJSON packet.
     * @throws Error if attempting to send a chat message when not connected or authenticated.
     */
    public async chat(text: string): Promise<void> {
        if (!this.#client.authenticated) {
            throw new Error("Cannot send chat messages without logging in first.");
        }

        text = text.trim();
        const request: SayPacket = { cmd: "Say", text };
        await this.#client.socket
            .send(request)
            .wait("PrintJSON", (_, message) => message === text);
    }
}

/**
 * An interface with all supported message events and their respective callback arguments. To be called from
 * {@link MessageManager}.
 */
export type MessageEvents = {
    /**
     * Fires when any message is received.
     * @param message The plaintext message content.
     * @param index The index of this message in {@link MessageManager.messages}, when this event was fired. If message
     * logging is disabled, this will return `-1`.
     * @param packet The received PrintJSONPacket, if needed to reconstruct into a specialized message.
     */
    ReceivedMessage: [message: string, index: number, packet: PrintJSONPacket]
};
