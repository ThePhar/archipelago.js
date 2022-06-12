import { APBasePacket } from "../__base";

export interface LocationChecksPacket extends APBasePacket {
    readonly cmd: "LocationChecks";
    readonly locations: number[];
}
