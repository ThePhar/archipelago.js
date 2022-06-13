import { CommandPacketType } from "@enums";
import { BasePacket } from "@packets";

export class SyncPacket implements BasePacket {
    public readonly cmd = CommandPacketType.SYNC;
}
