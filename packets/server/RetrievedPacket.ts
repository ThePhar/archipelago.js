import { BasePacket } from "@packets";
import { APType } from "@structs";

export interface RetrievedPacket extends BasePacket {
    readonly cmd: "Retrieved";
    readonly keys: { [key: string]: APType };
}
