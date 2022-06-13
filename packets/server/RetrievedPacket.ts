import { CommandPacketType } from "@enums";
import { BasePacket } from "@packets";
import { APType } from "@structs";

export interface RetrievedPacket extends BasePacket {
    readonly cmd: CommandPacketType.RETRIEVED;
    readonly keys: { [key: string]: APType };
}
