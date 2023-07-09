import { BaseClientPacket } from "./BasePackets";

/**
 * Sent to server to request a {@link ReceivedItemsPacket} to resynchronize items if a "desync" ever occurs.
 *
 * @category Client Packets
 */
export interface SyncPacket extends BaseClientPacket {
    cmd: "Sync";
}
