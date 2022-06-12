import { APBasePacket } from "../__base";

export interface LocationScoutsPacket extends APBasePacket {
    readonly cmd: "LocationScouts";
    readonly locations: number[];
    readonly create_as_hint: boolean;
}
