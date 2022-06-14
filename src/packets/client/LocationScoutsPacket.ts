import { CommandPacketType } from "@enums";
import { BasePacket } from "@packets";

export interface LocationScoutsPacket extends BasePacket {
    readonly cmd: CommandPacketType.LOCATION_SCOUTS;
    readonly locations: ReadonlyArray<number>;
    readonly create_as_hint: boolean;
}
