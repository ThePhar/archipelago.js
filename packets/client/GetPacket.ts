import { BasePacket } from "@packets";

export class GetPacket implements BasePacket {
    public readonly cmd = "Get";
    public readonly keys: ReadonlyArray<string>;

    public constructor(keys: string[]) {
        this.keys = keys;
    }
}
