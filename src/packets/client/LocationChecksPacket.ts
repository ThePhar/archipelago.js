import { ClientPacketType } from "../../enums";
import { ClientPacket } from "../index";

/**
 * Sent by the client to inform the server of locations that the client has checked. Used to inform the server of new
 * checks that are made, as well as to sync state.
 *
 * @category Client Packets
 */
export interface LocationChecksPacket extends ClientPacket {
    cmd: ClientPacketType.LOCATION_CHECKS;

    /**
     * The ids of the locations checked by the client. May contain any number of checks, even ones sent before;
     * duplicates do not cause issues with the Archipelago server.
     */
    locations: number[];
}
