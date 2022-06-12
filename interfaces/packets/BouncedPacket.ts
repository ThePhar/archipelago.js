import { APBaseObject, APBasePacket } from "../__base";

export interface BouncedPacket extends APBasePacket {
    readonly cmd: "Bounced";
    readonly games?: string[];
    readonly slots?: number[];
    readonly tags?: string[];
    readonly data: APBaseObject;
}
