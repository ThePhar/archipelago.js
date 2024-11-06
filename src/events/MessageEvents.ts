import { Item } from "../classes/Item.ts";
import { MessageNode } from "../classes/MessageNode.ts";
import { Player } from "../classes/Player.ts";

/**
 * An interface with all supported message events and their respective callback arguments. To be called from
 * {@link MessageManager}.
 */
export type MessageEvents = {
    /**
     * Fires when any kind of message is received.
     * @param text The plaintext message content.
     * @param nodes An array of message nodes in this message with additional context for each textual component.
     */
    message: [text: string, nodes: MessageNode[]]

    /**
     * Fires when another player is sent an item (except for cheated items).
     * @param text The plaintext message content.
     * @param item The item being sent.
     * @param nodes An array of message nodes in this message with additional context for each textual component.
     */
    itemSent: [text: string, item: Item, nodes: MessageNode[]]

    /**
     * Fires when another player is sent a cheated item.
     * @param text The plaintext message content.
     * @param item The item being sent.
     * @param nodes An array of message nodes in this message with additional context for each textual component.
     */
    itemCheated: [text: string, item: Item, nodes: MessageNode[]]

    /**
     * Fires when a hint-style message is received.
     * @param text The plaintext message content.
     * @param item The item being hinted.
     * @param found If the item was found.
     * @param nodes An array of message nodes in this message with additional context for each textual component.
     * @remarks This event is for hint messages received. To track more information on when hints are updated, utilize
     * one of the hint-type events on {@link ItemsManager} instead.
     */
    itemHinted: [text: string, item: Item, found: boolean, nodes: MessageNode[]]

    /**
     * Fires when a client connects to the room session.
     * @param text The plaintext message content.
     * @param player The player being connected as.
     * @param tags The tags of the joining client.
     * @param nodes An array of message nodes in this message with additional context for each textual component.
     */
    connected: [text: string, player: Player, tags: string[], nodes: MessageNode[]]

    /**
     * Fires when a client disconnects from the room session.
     * @param text The plaintext message content.
     * @param player The player being disconnected from.
     * @param nodes An array of message nodes in this message with additional context for each textual component.
     */
    disconnected: [text: string, player: Player, nodes: MessageNode[]]

    /**
     * Fires when a player chat message is received.
     * @param message The plaintext message content without the sender name prefix.
     * @param player The metadata of the player who sent this message.
     * @param nodes An array of message nodes in this message with additional context for each textual component.
     * @remarks `nodes` will contain the sender name prefix from the server, but `message` will not.
     */
    chat: [message: string, player: Player, nodes: MessageNode[]]

    /**
     * Fires when a server chat message is received.
     * @param message The plaintext message content without the sender name prefix.
     * @param nodes An array of message nodes in this message with additional context for each textual component.
     * @remarks `nodes` will contain the sender name prefix from the server, but `message` will not.
     */
    serverChat: [message: string, nodes: MessageNode[]]

    /**
     * Fires when tutorial-like information is received, such as on first connection explaining `!help`.
     * @param text The plaintext message content.
     * @param nodes An array of message nodes in this message with additional context for each textual component.
     */
    tutorial: [text: string, nodes: MessageNode[]]

    /**
     * Fires when a client updates their tags.
     * @param text The plaintext message content.
     * @param player The player this client is connected to.
     * @param tags The new tags for this client.
     * @param nodes An array of message nodes in this message with additional context for each textual component.
     */
    tagsUpdated: [text: string, player: Player, tags: string[], nodes: MessageNode[]]

    /**
     * Fires on the result of running a user command, such as `!status`.
     * @param text The plaintext message content.
     * @param nodes An array of message nodes in this message with additional context for each textual component.
     */
    userCommand: [text: string, nodes: MessageNode[]]

    /**
     * Fires on the result of running an admin command via `!admin`.
     * @param text The plaintext message content.
     * @param nodes An array of message nodes in this message with additional context for each textual component.
     */
    adminCommand: [text: string, nodes: MessageNode[]]

    /**
     * Fires when a connected player has met their goal condition.
     * @param text The plaintext message content.
     * @param player The player that reached their goal.
     * @param nodes An array of message nodes in this message with additional context for each textual component.
     */
    goaled: [text: string, player: Player, nodes: MessageNode[]]

    /**
     * Fires when a player has released their remaining items to the multi-world.
     * @param text The plaintext message content.
     * @param player The player that released.
     * @param nodes An array of message nodes in this message with additional context for each textual component.
     */
    released: [text: string, player: Player, nodes: MessageNode[]]

    /**
     * Fires when a player has collected their remaining items from the multi-world.
     * @param text The plaintext message content.
     * @param player The player that collected.
     * @param nodes An array of message nodes in this message with additional context for each textual component.
     */
    collected: [text: string, player: Player, nodes: MessageNode[]]

    /**
     * Fires when a countdown message is received.
     * @param text The plaintext message content.
     * @param value The current countdown value.
     * @param nodes An array of message nodes in this message with additional context for each textual component.
     */
    countdown: [text: string, value: number, nodes: MessageNode[]]
};
