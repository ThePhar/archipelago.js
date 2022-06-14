import { CommandPacketType } from "@enums";
import { BasePacket } from "@packets";
import { NetworkVersion } from "@structs";

export interface ConnectPacket extends BasePacket {
    readonly cmd: CommandPacketType.CONNECT;
    readonly uuid: string;
    readonly game: string;
    readonly name: string;
    readonly password: string;
    readonly version: NetworkVersion;
    readonly tags: ReadonlyArray<string>;
    readonly items_handling: number;
}
