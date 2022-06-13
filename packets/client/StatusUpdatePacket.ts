import { ClientStatus } from "@enums";
import { BasePacket } from "@packets";

export class StatusUpdatePacket implements BasePacket {
    public readonly cmd = "StatusUpdate";
    public readonly status: ClientStatus;

    public constructor(status: ClientStatus) {
        this.status = status;
    }
}
