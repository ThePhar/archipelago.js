import { ServerPacketType } from "../../enums";
import { NetworkItem } from "../../structs";
import { ServerPacket } from "../index";

/**
 * Sent to clients when they receive an item.
 *
 * @category Server Packets
 */
export interface ReceivedItemsPacket extends ServerPacket {
    cmd: ServerPacketType.RECEIVED_ITEMS;

    /** The next empty slot in the list of items for the receiving client. Useful for tracking items. */
    index: number;

    /** The items which the client is receiving. */
    items: NetworkItem[];
}
