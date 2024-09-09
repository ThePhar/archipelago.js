import { NetworkItem } from "../../types/NetworkItem.ts";

/**
 * Sent to clients when they receive an item.
 * @category Server Packets
 */
export type ReceivedItemsPacket = {
    readonly cmd: "ReceivedItems"

    /** The next empty slot in the list of items for the receiving client. Useful for tracking items. */
    readonly index: number

    /** The items which the client is receiving. */
    readonly items: NetworkItem[]
}
