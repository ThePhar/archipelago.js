import { HintJSONPacket, ItemCheatJSONPacket, ItemSendJSONPacket, PrintJSONPacket, SayPacket } from "../../api";
import { UnauthenticatedError } from "../../errors.ts";
import { MessageEvents } from "../../events/MessageEvents.ts";
import { Client } from "../Client.ts";
import { Item } from "../Item.ts";
import {
    ColorMessageNode,
    ItemMessageNode,
    LocationMessageNode,
    MessageNode,
    PlayerMessageNode, TextualMessageNode,
} from "../MessageNode.ts";
import { Player } from "../Player.ts";
import { EventBasedManager } from "./EventBasedManager.ts";

/** A type for logged messages on {@link MessageManager}. */
export type MessageLog = { text: string, nodes: MessageNode[] }[];

/**
 * Manages and stores {@link PrintJSONPacket} messages, notifies subscribers of new messages, and exposes helper methods
 * to interact with the chat system.
 */
export class MessageManager extends EventBasedManager<MessageEvents> {
    readonly #client: Client;
    readonly #messages: MessageLog = [];

    /**
     * Returns a shallow copy of all logged chat messages.
     *
     * If the messages length is greater than {@link ClientOptions.maximumMessages}, the oldest messages are spliced
     * out.
     */
    public get log(): MessageLog {
        return [...this.#messages];
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
        this.#client.socket.on("printJSON", this.#onPrintJSON.bind(this));
    }

    /**
     * Sends a chat message to the server.
     * @param text The textual message to broadcast to all connected clients.
     * @returns A promise that resolves when the server has broadcast the chat message.
     * @throws UnauthenticatedError if attempting to send a chat message when not connected or authenticated.
     */
    public async say(text: string): Promise<void> {
        if (!this.#client.authenticated) {
            throw new UnauthenticatedError("Cannot send chat messages without being authenticated.");
        }

        text = text.trim();
        const request: SayPacket = { cmd: "Say", text };
        this.#client.socket.send(request);
        await this.wait("chat", (message) => message === text);
    }

    #onPrintJSON(packet: PrintJSONPacket): void {
        // Build nodes
        const nodes: MessageNode[] = [];
        for (const part of packet.data) {
            switch (part.type) {
                case "item_id":
                case "item_name": {
                    const itemPacket = packet as ItemSendJSONPacket | ItemCheatJSONPacket | HintJSONPacket;
                    let receiver: Player;
                    if (itemPacket.type === "ItemCheat") {
                        receiver = this.#client.players.findPlayer(itemPacket.receiving, itemPacket.team) as Player;
                    } else {
                        receiver = this.#client.players.findPlayer(itemPacket.receiving) as Player;
                    }

                    nodes.push(new ItemMessageNode(this.#client, part, itemPacket.item, receiver));
                    break;
                }

                case "location_id":
                case "location_name": {
                    nodes.push(new LocationMessageNode(this.#client, part));
                    break;
                }

                case "color": {
                    nodes.push(new ColorMessageNode(this.#client, part));
                    break;
                }

                case "player_id":
                case "player_name": {
                    nodes.push(new PlayerMessageNode(this.#client, part));
                    break;
                }

                default: {
                    nodes.push(new TextualMessageNode(this.#client, part));
                    break;
                }
            }
        }

        const text = nodes.map((node) => node.text).join();

        // Add the message to the log.
        if (this.#client.options.maximumMessages >= 1) {
            this.log.push({ text, nodes });
            this.log.splice(0, this.log.length - this.#client.options.maximumMessages);
        }

        // Fire relevant event.
        switch (packet.type) {
            case "ItemSend": {
                const sender = this.#client.players.findPlayer(packet.item.player) as Player;
                const receiver = this.#client.players.findPlayer(packet.receiving) as Player;
                const item = new Item(this.#client, packet.item, sender, receiver);
                this.emit("itemSent", [text, item, nodes]);
                break;
            }
            case "ItemCheat": {
                const sender = this.#client.players.findPlayer(packet.item.player, packet.team) as Player;
                const receiver = this.#client.players.findPlayer(packet.receiving, packet.team) as Player;
                const item = new Item(this.#client, packet.item, sender, receiver);
                this.emit("itemCheated", [text, item, nodes]);
                break;
            }
            case "Hint": {
                const sender = this.#client.players.findPlayer(packet.item.player) as Player;
                const receiver = this.#client.players.findPlayer(packet.receiving) as Player;
                const item = new Item(this.#client, packet.item, sender, receiver);
                this.emit("itemHinted", [text, item, packet.found, nodes]);
                break;
            }
            case "Join": {
                const player = this.#client.players.findPlayer(packet.slot, packet.team) as Player;
                this.emit("connected", [text, player, packet.tags, nodes]);
                break;
            }
            case "Part": {
                const player = this.#client.players.findPlayer(packet.slot, packet.team) as Player;
                this.emit("disconnected", [text, player, nodes]);
                break;
            }
            case "Chat": {
                const player = this.#client.players.findPlayer(packet.slot, packet.team) as Player;
                this.emit("chat", [packet.message, player, nodes]);
                break;
            }
            case "ServerChat": {
                this.emit("serverChat", [packet.message, nodes]);
                break;
            }
            case "TagsChanged": {
                const player = this.#client.players.findPlayer(packet.slot, packet.team) as Player;
                this.emit("tagsUpdated", [text, player, packet.tags, nodes]);
                break;
            }
            case "Tutorial": {
                this.emit("tutorial", [text, nodes]);
                break;
            }
            case "CommandResult": {
                this.emit("userCommand", [text, nodes]);
                break;
            }
            case "AdminCommandResult": {
                this.emit("adminCommand", [text, nodes]);
                break;
            }
            case "Goal": {
                const player = this.#client.players.findPlayer(packet.slot, packet.team) as Player;
                this.emit("goaled", [text, player, nodes]);
                break;
            }
            case "Release": {
                const player = this.#client.players.findPlayer(packet.slot, packet.team) as Player;
                this.emit("released", [text, player, nodes]);
                break;
            }
            case "Collect": {
                const player = this.#client.players.findPlayer(packet.slot, packet.team) as Player;
                this.emit("collected", [text, player, nodes]);
                break;
            }
            case "Countdown": {
                this.emit("countdown", [text, packet.countdown, nodes]);
            }
        }

        // Generic event is called last.
        this.emit("message", [text, nodes]);
    }
}
