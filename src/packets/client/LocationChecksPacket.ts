import { CommandPacketType } from "@enums";
import { BasePacket } from "@packets";

/**
 * Sent by the client to inform the server of locations that the client has checked. Used to inform the server of new
 * checks that are made, as well as to sync state.
 *
 * @category Client Packets
 */
export interface LocationChecksPacket extends BasePacket {
    cmd: CommandPacketType.LOCATION_CHECKS;

    /**
     * The ids of the locations checked by the client. May contain any number of checks, even ones sent before;
     * duplicates do not cause issues with the Archipelago server.
     */
    locations: number[];
}
