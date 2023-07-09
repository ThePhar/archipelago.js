import { NetworkPlayer } from "../types/NetworkPlayer";
import { NetworkSlot } from "../types/NetworkSlot";
import { UnknownSlotData } from "../types/UnknownSlotData";
import { BaseServerPacket } from "./BasePackets";

/**
 * Sent to clients when the connection handshake is successfully completed.
 *
 * @category Server Packets
 */
export interface ConnectedPacket extends BaseServerPacket {
    cmd: "Connected";

    /** Your team number. See {@link NetworkPlayer} for more info on team number. */
    team: number;

    /** Your slot number on your team. See {@link NetworkPlayer} for more info on the slot number. */
    slot: number;

    /** List denoting other players in the multi-world, whether connected or not. */
    players: NetworkPlayer[];

    /** Contains ids of remaining locations that need to be checked. Useful for trackers, among other things. */
    missing_locations: number[];

    /**
     * Contains ids of all locations that have been checked. Useful for trackers, among other things. Location ids are
     * in the range of  -2^53^ to +2^53^-1.
     */
    checked_locations: number[];

    /** Contains a json object for slot related data, differs per game. Empty if not required. */
    slot_data: UnknownSlotData;

    /** Object of each slot with their {@link NetworkSlot} information. */
    slot_info: { [slot: number]: NetworkSlot };

    /** Number of hint points that the current player has. */
    hint_points: number;
}
