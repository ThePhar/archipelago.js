import { PrintJSONPacket } from "../api";
import { Player } from "../classes/Player.ts";

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
    receivedMessage: [message: string, index: number, packet: PrintJSONPacket]

    /**
     * Fires when a countdown message is received.
     * @param message The plaintext message content.
     * @param index The index of this message in {@link MessageManager.messages}, when this event was fired. If message
     * logging is disabled, this will return `-1`.
     * @param value The current countdown value.
     */
    countdown: [message: string, index: number, value: number]

    /**
     * Fires when a player message is received.
     * @param message The plaintext message content.
     * @param index The index of this message in {@link MessageManager.messages}, when this event was fired. If message
     * logging is disabled, this will return `-1`.
     * @param sender The metadata of the player who sent this message.
     */
    chatMessage: [message: string, index: number, sender: Player]
};
