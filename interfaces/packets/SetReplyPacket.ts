import { APBasePacket, APType } from "../__base";

export interface SetReplyPacket extends APBasePacket {
    readonly cmd: "SetReply";
    readonly key: string;
    readonly value: APType;
    readonly original_value: APType;
}
