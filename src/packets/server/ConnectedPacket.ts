import { CommandPacketType } from "../../enums";
import { APBaseObject, NetworkPlayer, NetworkSlot } from "../../structs";
import { BasePacket } from "../index";

/**
 * Sent to clients when the connection handshake is successfully completed.
 *
 * @category Server Packets
 */
export interface ConnectedPacket extends BasePacket {
    cmd: CommandPacketType.CONNECTED;

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
    slot_data: APBaseObject;

    /** Object of each slot with their {@link NetworkSlot} information. */
    slot_info: { [slot: number]: NetworkSlot };
}
