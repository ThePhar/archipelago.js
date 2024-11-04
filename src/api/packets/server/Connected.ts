import { JSONSerializable, NetworkPlayer, NetworkSlot } from "../../types.ts";

/**
 * Sent to clients when the connection handshake is successfully completed.
 * @category Network Packets
 */
export interface ConnectedPacket {
    readonly cmd: "Connected"

    /** Your team number. See {@link NetworkPlayer} for more info on team number. */
    readonly team: number

    /** Your slot number on your team. See {@link NetworkPlayer} for more info on the slot number. */
    readonly slot: number

    /** List denoting other players in the multi-world, whether connected or not. */
    readonly players: NetworkPlayer[]

    /** Contains integer ids of remaining locations that need to be checked. Useful for trackers, among other things. */
    readonly missing_locations: number[]

    /**
     * Contains integer ids of all locations that have been checked. Useful for trackers, among other things. Location
     * ids are valid in the range of  -2^53^ to +(2^53)-1 (inclusive), with negative values and zero reserved for
     * Archipelago.
     */
    readonly checked_locations: number[]

    /**
     * Contains an object of slot related data, which differs per slot. If slot data was not requested in the
     * {@link ConnectPacket}, this value be an empty object.
     */
    readonly slot_data: JSONSerializable

    /** Object of each slot with their {@link NetworkSlot} information. */
    readonly slot_info: Record<string, NetworkSlot>

    /** Number of hint points that the current player has. */
    readonly hint_points: number
}
