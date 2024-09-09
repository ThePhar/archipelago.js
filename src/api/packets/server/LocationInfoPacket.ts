import { NetworkItem } from "../../types/NetworkItem.ts";

/**
 * Sent to clients to acknowledge a received {@link LocationScoutsPacket} and responds with the item in each location
 * being scouted.
 * @category Server Packets
 */
export type LocationInfoPacket = {
    readonly cmd: "LocationInfo"

    /** Contains the list of item(s) in the location(s) scouted. */
    readonly locations: NetworkItem[]
};
