import { ClientPacket } from "./BasePacket.ts";
import { ClientPacketType } from "./CommandPacketType.ts";

/**
 * Used to register your current session for receiving all {@link SetReplyPacket}s of certain keys to allow your client
 * to keep track of changes.
 *
 * @category Client Packets
 */
export interface SetNotifyPacket extends ClientPacket {
    cmd: ClientPacketType.SET_NOTIFY;

    /** Keys to receive all {@link SetReplyPacket}s for. */
    keys: string[];
}
