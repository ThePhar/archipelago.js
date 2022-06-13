import { BasePacket } from "@packets";
import { NetworkItem } from "@structs";

export interface ReceivedItemsPacket extends BasePacket {
    readonly cmd: "ReceivedItems";
    readonly index: number;
    readonly items: NetworkItem[];
}
