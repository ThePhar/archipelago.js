/**
 * Sent by the client to inform the server of locations the client has seen, but not checked. Useful in cases in which
 * the item may appear in the game world, but may not be immediately gettable. The server will always respond with a
 * {@link LocationInfoPacket} with the items located in the scouted location.
 * @category Network Packets
 */
export interface LocationScoutsPacket {
    readonly cmd: "LocationScouts"

    /**
     * The ids of the locations seen by the client. May contain any number of locations, even ones sent before;
     * duplicates do not cause issues with the Archipelago server.
     */
    readonly locations: number[]

    /**
     * - If set to `0`, this packet will not create hints for any locations in this packet.
     * - If set to `1`, this packet will create hints for all locations in this packet and broadcast them to all
     * relevant clients.
     * - If set to `2`, this packet will create hints for all locations in this packet and broadcast only new hints to
     * all relevant clients.
     */
    readonly create_as_hint: 0 | 1 | 2
}
