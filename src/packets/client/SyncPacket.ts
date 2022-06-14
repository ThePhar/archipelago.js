import { CommandPacketType } from "@enums";
import { BasePacket } from "@packets";

export interface SyncPacket extends BasePacket {
    readonly cmd: CommandPacketType.SYNC;
}
