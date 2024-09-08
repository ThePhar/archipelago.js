import { ClientPacketType } from "../enums/CommandPacketTypes.ts";

/**
 * Used to register your current session for receiving all {@link SetReplyPacket}s of certain keys to allow your client
 * to keep track of changes.
 * @internal
 * @category Client Packets
 */
export interface SetNotifyPacket {
    readonly cmd: ClientPacketType.SetNotify

    /** Keys to receive all {@link SetReplyPacket}s for. */
    readonly keys: string[]
}
