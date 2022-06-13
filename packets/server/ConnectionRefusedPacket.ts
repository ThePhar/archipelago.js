import { BasePacket } from "@packets";

export interface ConnectionRefusedPacket extends BasePacket {
    readonly cmd: "ConnectionRefused";
    readonly errors?: string[];
}
