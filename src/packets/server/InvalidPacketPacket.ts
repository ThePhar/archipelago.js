import { CommandPacketType, PacketProblemType } from "../../enums";
import { BasePacket } from "../index";

/**
 * Sent to clients if the server caught a problem with a packet. This only occurs for errors that are explicitly checked
 * for.
 *
 * @category Server Packets
 */
export interface InvalidPacketPacket extends BasePacket {
    cmd: CommandPacketType.INVALID_PACKET;

    /** The {@link PacketProblemType} that was detected in the packet. */
    type: PacketProblemType;

    /** The `cmd` argument of the faulty packet, will be `undefined` or `null` if the `cmd` failed to be parsed. */
    original_cmd?: string;

    /** A descriptive message of the problem at hand. */
    text: string;
}
