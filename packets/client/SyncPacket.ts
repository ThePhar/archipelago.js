import { BasePacket } from "@packets";

export class SyncPacket implements BasePacket {
    public readonly cmd = "Sync";
}
