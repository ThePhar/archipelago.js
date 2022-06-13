import { CommandPacketType } from "@enums";
import { BasePacket } from "@packets";

export interface InvalidPacketPacket extends BasePacket {
    readonly cmd: CommandPacketType.INVALID_PACKET;
}
