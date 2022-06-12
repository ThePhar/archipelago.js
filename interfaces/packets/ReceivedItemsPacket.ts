import { APBasePacket } from "../__base";
import { NetworkItem } from "../NetworkItem";

export interface ReceivedItemsPacket extends APBasePacket {
    readonly cmd: "ReceivedItems";
    readonly index: number;
    readonly items: NetworkItem[];
}
