import { CommandPacketType } from "@enums";
import { BasePacket } from "@packets";

export interface ConnectUpdatePacket extends BasePacket {
    cmd: CommandPacketType.CONNECT_UPDATE;
    items_handling: number;
    tags: ReadonlyArray<string>;
}
