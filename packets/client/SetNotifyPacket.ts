import { CommandPacketType } from "@enums";
import { BasePacket } from "@packets";

export class SetNotifyPacket implements BasePacket {
    public readonly cmd = CommandPacketType.SET_NOTIFY;
    public readonly keys: ReadonlyArray<string>;

    public constructor(keys: string[]) {
        this.keys = keys;
    }
}
