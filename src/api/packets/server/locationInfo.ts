import { NetworkItem } from "../../types.ts";

/**
 * Sent to clients to acknowledge a received {@link LocationScoutsPacket} and responds with the item in each location
 * being scouted.
 * @category Network Packets
 */
export interface LocationInfoPacket {
    readonly cmd: "LocationInfo"

    /** Contains the list of item(s) in the location(s) scouted. */
    readonly locations: NetworkItem[]
}
