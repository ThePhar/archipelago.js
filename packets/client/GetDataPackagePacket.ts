import { CommandPacketType } from "@enums";
import { BasePacket } from "@packets";

export class GetDataPackagePacket implements BasePacket {
    public readonly cmd = CommandPacketType.GET_DATA_PACKAGE;
    public readonly games?: ReadonlyArray<string>;

    public constructor(games?: string[]) {
        this.games = games;
    }
}
