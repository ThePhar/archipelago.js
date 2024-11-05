import { PrintJSONPacket, SayPacket } from "../../api";
import { UnauthenticatedError } from "../../errors.ts";
import { MessageEvents } from "../../events/MessageEvents.ts";
import { Client } from "../Client.ts";
import { Player } from "../Player.ts";
import { EventBasedManager } from "./EventBasedManager.ts";

/**
 * Manages and stores {@link PrintJSONPacket} messages, notifies subscribers of new messages, and exposes helper methods
 * to interact with the chat system.
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
        super();
        this.#client = client;

        // Log messages and emit events.
        this.#client.socket.on("printJSON", (packet, message) => {
            let index = -1;
            if (this.#client.options.maximumMessages >= 1) {
                this.messages.push({ message, packet });
                this.messages.splice(0, this.messages.length - this.#client.options.maximumMessages);
                index = this.messages.length - 1;
            }

            this.emit("receivedMessage", [message, index, packet]);

            // Special packets.
            switch (packet.type) {
                case "Chat":
                    this.emit("chatMessage", [
                        message,
                        index,
                        this.#client.players.findPlayer(packet.team, packet.slot) as Player,
                    ]);
                    break;
                case "Countdown":
                    this.emit("countdown", [message, index, packet.countdown]);
                    break;
            }
        });
    }

    /**
     * Sends a chat message to the server.
     * @param text The textual message to broadcast to all connected clients.
     * @returns A promise that resolves when the server responds with the PrintJSON packet.
     * @throws UnauthenticatedError if attempting to send a chat message when not connected or authenticated.
     */
    public async say(text: string): Promise<void> {
        if (!this.#client.authenticated) {
            throw new UnauthenticatedError("Cannot send chat messages without being authenticated.");
        }

        text = text.trim();
        const request: SayPacket = { cmd: "Say", text };
        await this.#client.socket
            .send(request)
            .wait("printJSON", (_, message) => message === text);
    }
}
