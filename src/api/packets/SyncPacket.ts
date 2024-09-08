import { ClientPacketType } from "../enums/CommandPacketTypes";

/**
 * Sent to server to request a {@link ReceivedItemsPacket} to resynchronize items if a "desync" ever occurs.
 * @internal
 * @remarks Should ideally not need to be used, so if you find yourself relying on this, you may want to reevaluate why.
 * @category Client Packets
 */
export interface SyncPacket {
    readonly cmd: ClientPacketType.Sync
}
