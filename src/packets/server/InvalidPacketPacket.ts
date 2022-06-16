import { CommandPacketType } from "@enums";
import { BasePacket } from "@packets";

/**
 * Sent to clients if the server caught a problem with a packet. This only occurs for errors that are explicitly checked
 * for.
 *
 * @category Server Packets
 */
export interface InvalidPacketPacket extends BasePacket {
    cmd: CommandPacketType.INVALID_PACKET;
}
