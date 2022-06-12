import { APBasePacket } from "../__base";

export interface GetPacket extends APBasePacket {
    readonly cmd: "Get";
    readonly keys: string[];
}
