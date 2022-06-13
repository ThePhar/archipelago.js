import { BasePacket } from "@packets";

export class LocationScoutsPacket implements BasePacket {
    public readonly cmd = "LocationScouts";
    public readonly locations: ReadonlyArray<number>;
    public readonly create_as_hint: boolean;

    public constructor(locations: number[], createAsHint = false) {
        this.locations = locations;
        this.create_as_hint = createAsHint;
    }
}
