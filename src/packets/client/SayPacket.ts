import { ClientPacketType } from "../../enums";
import { ClientPacket } from "../index";

/**
 * Basic chat-type packet which sends text to the server to be distributed to other clients.
 *
 * @category Client Packets
 */
export interface SayPacket extends ClientPacket {
    cmd: ClientPacketType.SAY;

    /** Text to send to others. */
    text: string;
}
