import { BasePacket } from "@packets";
import { NetworkItem } from "@structs";

export interface LocationInfoPacket extends BasePacket {
    readonly cmd: "LocationInfo";
    readonly locations: NetworkItem[];
}
