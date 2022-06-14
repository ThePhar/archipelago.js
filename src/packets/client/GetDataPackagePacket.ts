import { CommandPacketType } from "@enums";
import { BasePacket } from "@packets";

export interface GetDataPackagePacket extends BasePacket {
    readonly cmd: CommandPacketType.GET_DATA_PACKAGE;
    readonly games?: ReadonlyArray<string>;
}
