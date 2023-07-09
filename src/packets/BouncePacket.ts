import { JSONSerializableData } from "../types/JSONSerializableData";
import { BaseClientPacket } from "./BasePackets";

/**
 * Sent by the client to have the server forward data to all clients that satisfy any given search criteria.
 *
 * @category Client Packets
 */
export interface BouncePacket extends BaseClientPacket {
    cmd: "Bounce";

    /** Any data you want to send. */
    data: JSONSerializableData;

    /** Optional. Game names that should receive this message. */
    games?: string[];

    /** Optional. Player IDs that should receive this message. */
    slots?: number[];

    /** Optional. Client tags that should receive this message. */
    tags?: string[];
}
