import { BasePacket } from "@packets";

export class GetDataPackagePacket implements BasePacket {
    public readonly cmd = "GetDataPackage";
    public readonly games?: ReadonlyArray<string>;

    public constructor(games?: string[]) {
        this.games = games;
    }
}
