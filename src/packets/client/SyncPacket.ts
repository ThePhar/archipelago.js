import { ClientPacketType } from "../../enums";
import { ClientPacket } from "../index";

/**
 * Sent to server to request a {@link ReceivedItemsPacket} to resynchronize items if a "desync" ever occurs.
 *
 * @category Client Packets
 */
export interface SyncPacket extends ClientPacket {
    cmd: ClientPacketType.SYNC;
}
