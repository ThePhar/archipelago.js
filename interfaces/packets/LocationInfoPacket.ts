import { APBasePacket } from "../__base";
import { NetworkItem } from "../NetworkItem";

export interface LocationInfoPacket extends APBasePacket {
    readonly cmd: "LocationInfo";
    readonly locations: NetworkItem[];
}
