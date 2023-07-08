import { NetworkItem } from "../types/NetworkItem.ts";
import { BaseServerPacket } from "./BasePackets.ts";

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
