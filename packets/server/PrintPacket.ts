import { BasePacket } from "@packets";

export interface PrintPacket extends BasePacket {
    readonly cmd: "Print";
    readonly text: string;
}
