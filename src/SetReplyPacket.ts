import { ServerPacket } from "./BasePacket.ts";
import { ServerPacketType } from "./CommandPacketType.ts";
import { APType } from "./APTypes.ts";

/**
 * Sent to clients in response to a {@link SetPacket} if `want_reply` was set to true, or if the client has registered
 * to receive updates for a certain key using the {@link SetNotifyPacket}. {@link SetReplyPacket}s are sent even if a
 * {@link SetPacket} package did not alter the value for the key.
 *
 * Additional arguments added to the {@link SetPacket} that triggered this {@link SetReplyPacket} will also be passed
 * along.
 *
 * @category Server Packets
 */
export interface SetReplyPacket extends ServerPacket {
    readonly cmd: ServerPacketType.SET_REPLY;

    /** The key that was updated. */
    readonly key: string;

    /** The new value for the key. */
    readonly value: APType;

    /** The value the key had before it was updated. */
    readonly original_value: APType;
}
