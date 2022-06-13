import { CommandPacketType } from "@enums";
import { BasePacket } from "@packets";

export class GetPacket implements BasePacket {
    public readonly cmd = CommandPacketType.GET;
    public readonly keys: ReadonlyArray<string>;

    public constructor(keys: string[]) {
        this.keys = keys;
    }
}
