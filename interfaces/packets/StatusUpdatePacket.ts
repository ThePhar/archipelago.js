import { APBasePacket } from "../__base";
import { ClientStatus } from "../../enums/ClientStatus";

export interface StatusUpdatePacket extends APBasePacket {
    readonly cmd: "StatusUpdate";
    readonly status: ClientStatus;
}
