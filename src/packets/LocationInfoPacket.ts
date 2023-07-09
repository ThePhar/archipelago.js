import { NetworkItem } from "../types/NetworkItem";
import { BaseServerPacket } from "./BasePackets";

/**
 * Sent to clients to acknowledge a received {@link LocationScoutsPacket} and responds with the item in each location
 * being scouted.
 *
 * @category Server Packets
 */
export interface LocationInfoPacket extends BaseServerPacket {
    cmd: "LocationInfo";

    /** Contains list of item(s) in the location(s) scouted. */
    locations: NetworkItem[];
}
