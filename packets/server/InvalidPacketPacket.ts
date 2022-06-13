import { BasePacket } from "@packets";

export interface InvalidPacketPacket extends BasePacket {
    readonly cmd: "InvalidPacket";
}
