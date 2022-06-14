import { CommandPacketType } from "@enums";
import { BasePacket } from "@packets";

export interface PrintPacket extends BasePacket {
    readonly cmd: CommandPacketType.PRINT;
    readonly text: string;
}
