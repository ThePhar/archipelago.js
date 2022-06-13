import { CommandPacketType } from "@enums";
import { BasePacket } from "@packets";
import { JSONMessagePart, NetworkItem } from "@structs";

export interface PrintJSONPacket extends BasePacket {
    readonly cmd: CommandPacketType.PRINT_JSON;
    readonly data: JSONMessagePart[];
    readonly type?: string;
    readonly receiving?: number;
    readonly item?: NetworkItem;
    readonly found?: boolean;
}
