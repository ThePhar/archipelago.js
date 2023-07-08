import { ServerPacket } from "./BasePacket.ts";
import { ServerPacketType } from "./CommandPacketType.ts";
import { NetworkItem } from "./NetworkItem.ts";

/**
 * Sent to clients to acknowledge a received {@link LocationScoutsPacket} and responds with the item in each location
 * being scouted.
 *
 * @category Server Packets
 */
export interface LocationInfoPacket extends ServerPacket {
    cmd: ServerPacketType.LOCATION_INFO;

    /** Contains list of item(s) in the location(s) scouted. */
    locations: NetworkItem[];
}
