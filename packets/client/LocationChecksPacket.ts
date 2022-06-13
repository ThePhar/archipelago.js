import { CommandPacketType } from "@enums";
import { BasePacket } from "@packets";

export class LocationChecksPacket implements BasePacket {
    public readonly cmd = CommandPacketType.LOCATION_CHECKS;
    public readonly locations: ReadonlyArray<number>;

    public constructor(locations: number[]) {
        this.locations = locations;
    }
}
