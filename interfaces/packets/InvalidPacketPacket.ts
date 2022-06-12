import { APBasePacket } from "../__base";

export interface InvalidPacketPacket extends APBasePacket {
    readonly cmd: "InvalidPacket";
}
