import { APBasePacket } from "../__base";

export interface ConnectionRefusedPacket extends APBasePacket {
    readonly cmd: "ConnectionRefused";
    readonly errors?: string[];
}
