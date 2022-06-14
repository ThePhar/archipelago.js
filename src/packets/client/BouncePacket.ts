import { CommandPacketType } from "@enums";
import { BasePacket } from "@packets";
import { APBaseObject } from "@structs";

export interface BouncePacket extends BasePacket {
    readonly cmd: CommandPacketType.BOUNCE;
    readonly data: APBaseObject;
    readonly games?: ReadonlyArray<string>;
    readonly slots?: ReadonlyArray<number>;
    readonly tags?: ReadonlyArray<string>;
}
