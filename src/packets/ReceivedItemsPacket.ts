import { NetworkItem } from "../types/NetworkItem.ts";
import { BaseServerPacket } from "./BasePackets.ts";

/**
 * Sent to clients when they receive an item.
 *
 * @category Server Packets
 */
export interface ReceivedItemsPacket extends BaseServerPacket {
    cmd: "ReceivedItems";

    /** The next empty slot in the list of items for the receiving client. Useful for tracking items. */
    index: number;

    /** The items which the client is receiving. */
    items: NetworkItem[];
}
