import { ServerPacketType } from "../enums/CommandPacketTypes";
import { NetworkItem } from "../types/NetworkItem";

/**
 * Sent to clients to acknowledge a received {@link LocationScoutsPacket} and responds with the item in each location
 * being scouted.
 * @internal
 * @category Server Packets
 */
export interface LocationInfoPacket {
    readonly cmd: ServerPacketType.LocationInfo

    /** Contains the list of item(s) in the location(s) scouted. */
    readonly locations: NetworkItem[]
}
