import { APBasePacket } from "../__base";

export interface SetNotifyPacket extends APBasePacket {
    readonly cmd: "SetNotify";
    readonly keys: string[];
}
