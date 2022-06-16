import { CommandPacketType } from "../../enums";
import { NetworkItem } from "../../structs";
import { BasePacket } from "../index";

/**
 * Sent to clients to acknowledge a received {@link LocationScoutsPacket} and responds with the item in each location
 * being scouted.
 *
 * @category Server Packets
 */
export interface LocationInfoPacket extends BasePacket {
    cmd: CommandPacketType.LOCATION_INFO;

    /** Contains list of item(s) in the location(s) scouted. */
    locations: NetworkItem[];
}
