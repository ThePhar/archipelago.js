import { CommandPacketType } from "@enums";
import { BasePacket } from "@packets";

export interface SetNotifyPacket extends BasePacket {
    readonly cmd: CommandPacketType.SET_NOTIFY;
    readonly keys: ReadonlyArray<string>;
}
