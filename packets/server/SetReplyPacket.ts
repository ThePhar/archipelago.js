import { BasePacket } from "@packets";
import { APType } from "@structs";

export interface SetReplyPacket extends BasePacket {
    readonly cmd: "SetReply";
    readonly key: string;
    readonly value: APType;
    readonly original_value: APType;
}
