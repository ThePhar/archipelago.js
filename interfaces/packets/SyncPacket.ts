import { APBasePacket } from "../__base";

export interface SyncPacket extends APBasePacket {
    readonly cmd: "Sync";
}
