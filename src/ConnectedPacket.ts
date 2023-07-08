import { ServerPacket } from "./BasePacket.ts";
import { ServerPacketType } from "./CommandPacketType.ts";
import { NetworkPlayer } from "./NetworkPlayer.ts";
import { AbstractSlotData } from "./AbstractSlotData.ts";
import { NetworkSlot } from "./NetworkSlot.ts";

/**
 * Sent to clients when the connection handshake is successfully completed.
 *
 * @category Server Packets
 */
export interface ConnectedPacket extends ServerPacket {
    cmd: ServerPacketType.CONNECTED;

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
     * in the range of ± 2^53-1.
     */
    checked_locations: number[];

    /** Contains a json object for slot related data, differs per game. Empty if not required. */
    slot_data: AbstractSlotData;

    /** Object of each slot with their {@link NetworkSlot} information. */
    slot_info: { [slot: number]: NetworkSlot };

    /** Number of hint points that the current player has. */
    hint_points: number;
}
