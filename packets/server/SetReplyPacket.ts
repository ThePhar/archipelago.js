import { CommandPacketType } from "@enums";
import { BasePacket } from "@packets";
import { APType } from "@structs";

export interface SetReplyPacket extends BasePacket {
    readonly cmd: CommandPacketType.SET_REPLY;
    readonly key: string;
    readonly value: APType;
    readonly original_value: APType;
}
