import { CommandPacketType } from "@enums";
import { BasePacket } from "@packets";
import { DataPackageObject } from "@structs";

export interface DataPackagePacket extends BasePacket {
    readonly cmd: CommandPacketType.DATA_PACKAGE;
    readonly data: DataPackageObject;
}
