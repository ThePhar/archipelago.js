/**
 * Sent to server to request a {@link ReceivedItemsPacket} with all items ever received.
 * @remarks In principle, a network desync of items should never occur, as if connection is broken and then
 * re-established, the server will resend all items ever received on reconnection, so use of this packet should never be
 * needed.
 * @category Network Packets
 */
export interface SyncPacket {
    readonly cmd: "Sync"
}
