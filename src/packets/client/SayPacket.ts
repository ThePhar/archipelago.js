import { CommandPacketType } from "@enums";
import { BasePacket } from "@packets";

/**
 * Basic chat-type packet which sends text to the server to be distributed to other clients.
 *
 * @category Client Packets
 */
export interface SayPacket extends BasePacket {
    cmd: CommandPacketType.SAY;

    /** Text to send to others. */
    text: string;
}
