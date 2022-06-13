import { CommandPacketType } from "@enums";
import { BasePacket } from "@packets";
import { APBaseObject } from "@structs";

export class BouncePacket implements BasePacket {
    public readonly cmd = CommandPacketType.BOUNCE;
    public readonly data: APBaseObject;
    public readonly games?: ReadonlyArray<string>;
    public readonly slots?: ReadonlyArray<number>;
    public readonly tags?: ReadonlyArray<string>;

    public constructor(data: APBaseObject, games?: string[], slots?: number[], tags?: string[]) {
        this.data = data;
        this.games = games;
        this.slots = slots;
        this.tags = tags;
    }
}
