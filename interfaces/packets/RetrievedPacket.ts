import { APBasePacket, APType } from "../__base";

export interface RetrievedPacket extends APBasePacket {
    readonly cmd: "Retrieved";
    readonly keys: { [key: string]: APType };
}
