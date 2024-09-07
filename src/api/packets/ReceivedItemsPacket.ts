import { NetworkItem } from "../types/NetworkItem";

/**
 * Sent to clients when they receive an item.
 * @internal
 * @category Server Packets
 */
export interface ReceivedItemsPacket {
    readonly cmd: "ReceivedItems"

    /** The next empty slot in the list of items for the receiving client. Useful for tracking items. */
    readonly index: number

    /** The items which the client is receiving. */
    readonly items: NetworkItem[]
}
