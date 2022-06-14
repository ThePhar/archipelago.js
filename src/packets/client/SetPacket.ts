import { CommandPacketType } from "@enums";
import { BasePacket } from "@packets";
import { APType, DataOperation } from "@structs";

export interface SetPacket extends BasePacket {
    readonly cmd: CommandPacketType.SET;
    readonly key: string;
    readonly default: APType;
    readonly operations: ReadonlyArray<DataOperation>;
    readonly want_reply?: boolean;
}
