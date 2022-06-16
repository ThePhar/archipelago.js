import { CommandPacketType } from "../../enums";
import { NetworkItem } from "../../structs";
import { BasePacket } from "../index";

/**
 * Sent to clients when they receive an item.
 *
 * @category Server Packets
 */
export interface ReceivedItemsPacket extends BasePacket {
    cmd: CommandPacketType.RECEIVED_ITEMS;

    /** The next empty slot in the list of items for the receiving client. */
    index: number;

    /** The items which the client is receiving. */
    items: NetworkItem[];
}
