import { ClientStatus, CommandPacketType } from "@enums";
import { BasePacket } from "@packets";

export interface StatusUpdatePacket extends BasePacket {
    readonly cmd: CommandPacketType.STATUS_UPDATE;
    readonly status: ClientStatus;
}
