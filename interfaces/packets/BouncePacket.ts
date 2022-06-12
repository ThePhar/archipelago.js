import { APBaseObject, APBasePacket } from "../__base";

export interface BouncePacket extends APBasePacket {
    readonly cmd: "Bounce";
    readonly games?: string[];
    readonly slots?: number[];
    readonly tags?: string[];
    readonly data: APBaseObject;
}
