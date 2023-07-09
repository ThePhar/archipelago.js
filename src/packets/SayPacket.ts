import { BaseClientPacket } from "./BasePackets";

/**
 * Basic chat-type packet which sends text to the server to be distributed to other clients.
 *
 * @category Client Packets
 */
export interface SayPacket extends BaseClientPacket {
    cmd: "Say";

    /** Text to send to others. */
    text: string;
}
