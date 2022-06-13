import { CommandPacketType } from "@enums";
import { BasePacket } from "@packets";

export interface ConnectionRefusedPacket extends BasePacket {
    readonly cmd: CommandPacketType.CONNECTION_REFUSED;
    readonly errors?: string[];
}
