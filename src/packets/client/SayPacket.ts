import { CommandPacketType } from "@enums";
import { BasePacket } from "@packets";

export interface SayPacket extends BasePacket {
    readonly cmd: CommandPacketType.SAY;
    readonly text: string;
}
