import { ClientPacket } from "./BasePacket.ts";
import { ClientPacketType } from "./CommandPacketType.ts";

/**
 * Sent to server to request a {@link ReceivedItemsPacket} to resynchronize items if a "desync" ever occurs.
 *
 * @category Client Packets
 */
export interface SyncPacket extends ClientPacket {
    cmd: ClientPacketType.SYNC;
}
