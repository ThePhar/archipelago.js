import { APBasePacket } from "../__base";

export interface PrintPacket extends APBasePacket {
    readonly cmd: "Print";
    readonly text: string;
}
