import { CommandPacketType } from "@enums";
import { BasePacket } from "@packets";

/**
 * Used to register your current session for receiving all {@link SetReplyPacket}s of certain keys to allow your client
 * to keep track of changes.
 *
 * @category Client Packets
 */
export interface SetNotifyPacket extends BasePacket {
    cmd: CommandPacketType.SET_NOTIFY;

    /** Keys to receive all {@link SetReplyPacket}s for. */
    keys: string[];
}
