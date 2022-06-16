import { CommandPacketType } from "@enums";
import { BasePacket } from "@packets";

/**
 * Sent to server to request a {@link ReceivedItemsPacket} to synchronize items.
 *
 * @category Client Packets
 */
export interface SyncPacket extends BasePacket {
    cmd: CommandPacketType.SYNC;
}
