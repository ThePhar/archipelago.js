import { CommandPacketType, PrintJSONType } from "@enums";
import { BasePacket } from "@packets";
import { JSONMessagePart, NetworkItem } from "@structs";

/**
 * Sent to clients purely to display a message to the player. This packet differs from a {@link PrintPacket} in that the
 * data being sent with this packet allows for more configurable or specific messaging.
 *
 * @category Server Packets
 */
export interface PrintJSONPacket extends BasePacket {
    cmd: CommandPacketType.PRINT_JSON;

    /** All of the data for this type of message. */
    data: JSONMessagePart[];

    /** May be present to indicate the nature of this message. Known types are specified in {@link PrintJSONType}. */
    type: string | PrintJSONType;

    /**
     * Is present if `type` is {@link PrintJSONType.HINT} or {@link PrintJSONType.ITEM_SEND} and marks the destination
     * player's ID.
     */
    receiving?: number;

    /**
     * Is present if `type` is {@link PrintJSONType.HINT} or {@link PrintJSONType.ITEM_SEND} and marks the source player
     * id, location id, item id and item flags.
     */
    item?: NetworkItem;

    /** Is present if `type` is {@link PrintJSONType.HINT} and denotes whether the location hinted for was checked. */
    found?: boolean;
}

/**
 * Sent to clients purely to display a message to the player. This packet differs from a {@link PrintPacket} in that the
 * data being sent with this packet allows for more configurable or specific messaging.
 *
 * This is a more specific version of {@link PrintJSONPacket} that includes required fields for
 * {@link PrintJSONType.HINT} type packets.
 *
 * @category Server Packets
 */
export interface HintPrintJSONPacket extends PrintJSONPacket {
    type: PrintJSONType.HINT;
    receiving: number;
    item: NetworkItem;
    found: boolean;
}

/**
 * Sent to clients purely to display a message to the player. This packet differs from a {@link PrintPacket} in that the
 * data being sent with this packet allows for more configurable or specific messaging.
 *
 * This is a more specific version of {@link PrintJSONPacket} that includes required fields for
 * {@link PrintJSONType.ITEM_SEND} type packets.
 *
 * @category Server Packets
 */
export interface ItemSendJSONPacket extends PrintJSONPacket {
    type: PrintJSONType.ITEM_SEND;
    receiving: number;
    item: NetworkItem;
    found: undefined;
}
