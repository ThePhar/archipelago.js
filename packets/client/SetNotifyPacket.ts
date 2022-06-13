import { BasePacket } from "@packets";

export class SetNotifyPacket implements BasePacket {
    public readonly cmd = "SetNotify";
    public readonly keys: ReadonlyArray<string>;

    public constructor(keys: string[]) {
        this.keys = keys;
    }
}
