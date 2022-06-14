import { CommandPacketType } from "@enums";
import { BasePacket } from "@packets";

export interface GetPacket extends BasePacket {
    readonly cmd: CommandPacketType.GET;
    readonly keys: ReadonlyArray<string>;
}
