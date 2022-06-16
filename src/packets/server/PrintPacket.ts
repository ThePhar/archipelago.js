import { CommandPacketType } from "../../enums";
import { BasePacket } from "../index";

/**
 * Sent to clients purely to display a message to the player.
 *
 * @category Server Packets
 */
export interface PrintPacket extends BasePacket {
    cmd: CommandPacketType.PRINT;

    /** Message to display to player. */
    text: string;
}
