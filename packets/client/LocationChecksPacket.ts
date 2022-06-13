import { BasePacket } from "@packets";

export class LocationChecksPacket implements BasePacket {
    public readonly cmd = "LocationChecks";
    public readonly locations: ReadonlyArray<number>;

    public constructor(locations: number[]) {
        this.locations = locations;
    }
}
