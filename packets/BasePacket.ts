import { CommandPacketType } from "@enums";

export interface BasePacket {
    readonly cmd: CommandPacketType;
}
