import { ClientPacketType } from "../../enums";
import { ClientPacket } from "../index";

/**
 * Sent by the client to have the server forward data to all clients that satisfy any given search criteria.
 *
 * @category Client Packets
 */
export interface BouncePacket extends ClientPacket {
    cmd: ClientPacketType.BOUNCE;

    /** Any data you want to send. */
    data: object;

    /** Optional. Game names that should receive this message. */
    games?: string[];

    /** Optional. Player IDs that should receive this message. */
    slots?: number[];

    /** Optional. Client tags that should receive this message. */
    tags?: string[];
}
