import { CommandPacketType } from "../../enums";
import { BasePacket } from "../index";

/**
 * Sent to clients after a client requested this message be sent to them, more info in the {@link BouncePacket}.
 *
 * @category Server Packets
 */
export interface BouncedPacket extends BasePacket {
    cmd: CommandPacketType.BOUNCED;

    /** Optional. Game names this message is targeting. */
    games?: string[];

    /** Optional. Player slot IDs that this message is targeting. */
    slots?: number[];

    /** Optional. Client tags this message is targeting. */
    tags?: string[];

    /** The data in the {@link BouncePacket} package copied */
    data: object;
}
