import { CommandPacketType } from "@enums";
import { BasePacket } from "@packets";
import { APBaseObject } from "@structs";

/**
 * Sent by the client to have the server forward data to to all clients that satisfy any given search criteria.
 *
 * @category Client Packets
 */
export interface BouncePacket extends BasePacket {
    cmd: CommandPacketType.BOUNCE;

    /** Any data you want to send. */
    data: APBaseObject;

    /** Optional. Game names that should receive this message. */
    games?: string[];

    /** Optional. Player IDs that should receive this message. */
    slots?: number[];

    /** Optional. Client tags that should receive this message. */
    tags?: string[];
}
