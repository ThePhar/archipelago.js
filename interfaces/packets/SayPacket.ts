import { APBasePacket } from "../__base";

export interface SayPacket extends APBasePacket {
    readonly cmd: "Say";
    readonly text: string;
}
