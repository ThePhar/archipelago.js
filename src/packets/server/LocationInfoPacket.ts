import { CommandPacketType } from "@enums";
import { BasePacket } from "@packets";
import { NetworkItem } from "@structs";

export interface LocationInfoPacket extends BasePacket {
    readonly cmd: CommandPacketType.LOCATION_INFO;
    readonly locations: NetworkItem[];
}
