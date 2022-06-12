import { APBasePacket } from "../__base";
import { JSONMessagePart } from "../JSONMessagePart";
import { NetworkItem } from "../NetworkItem";

export interface PrintJSONPacket extends APBasePacket {
    readonly cmd: "PrintJSON";
    readonly data: JSONMessagePart[];
    readonly type?: string;
    readonly receiving?: number;
    readonly item?: NetworkItem;
    readonly found?: boolean;
}
