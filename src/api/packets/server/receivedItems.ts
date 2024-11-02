import { NetworkItem } from "../../types.ts";

/**
 * Sent to clients when they receive an item.
 * @category Network Packets
 */
export interface ReceivedItemsPacket {
    readonly cmd: "ReceivedItems"

    /** The next empty slot in the list of items for the receiving client. Useful for tracking items. */
    readonly index: number

    /** The items which the client is receiving. */
    readonly items: NetworkItem[]
}
