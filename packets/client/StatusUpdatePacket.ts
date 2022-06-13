import { ClientStatus, CommandPacketType } from "@enums";
import { BasePacket } from "@packets";

export class StatusUpdatePacket implements BasePacket {
    public readonly cmd = CommandPacketType.STATUS_UPDATE;
    public readonly status: ClientStatus;

    public constructor(status: ClientStatus) {
        this.status = status;
    }
}
