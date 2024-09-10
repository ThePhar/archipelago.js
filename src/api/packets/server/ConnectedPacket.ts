import { AbstractSlotData } from "../../types/AbstractSlotData.ts";
import { NetworkPlayer } from "../../types/NetworkPlayer.ts";
import { NetworkSlot } from "../../types/NetworkSlot.ts";

/**
 * Sent to clients when the connection handshake is successfully completed.
 * @category Server Packets
 */
export type ConnectedPacket = {
    readonly cmd: "Connected"

    /** Your team number. See {@link NetworkPlayer} for more info on team number. */
    readonly team: number

    /** Your slot number on your team. See {@link NetworkPlayer} for more info on the slot number. */
    readonly slot: number

    /** List denoting other players in the multi-world, whether connected or not. */
    readonly players: NetworkPlayer[]

    /** Contains ids of remaining locations that need to be checked. Useful for trackers, among other things. */
    readonly missing_locations: number[]

    /**
     * Contains ids of all locations that have been checked. Useful for trackers, among other things. Location ids are
     * in the range of  -2^53^ to +2^53^-1.
     */
    readonly checked_locations: number[]

    /** Contains a json object for slot related data, differs per game. Empty if not required. */
    readonly slot_data: AbstractSlotData

    /** Object of each slot with their {@link NetworkSlot} information. */
    readonly slot_info: Record<string, NetworkSlot>

    /** Number of hint points that the current player has. */
    readonly hint_points: number
};
