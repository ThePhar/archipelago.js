import { CommandPacketType } from "@enums";
import { BasePacket } from "@packets";

export interface LocationChecksPacket extends BasePacket {
    readonly cmd: CommandPacketType.LOCATION_CHECKS;
    readonly locations: ReadonlyArray<number>;
}
