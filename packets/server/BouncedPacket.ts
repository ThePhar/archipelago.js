import { CommandPacketType } from "@enums";
import { BasePacket } from "@packets";
import { APBaseObject } from "@structs";

export interface BouncedPacket extends BasePacket {
    readonly cmd: CommandPacketType.BOUNCED;
    readonly games?: string[];
    readonly slots?: number[];
    readonly tags?: string[];
    readonly data: APBaseObject;
}
