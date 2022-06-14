import { CommandPacketType } from "@enums";
import { BasePacket } from "@packets";
import { NetworkItem } from "@structs";

export interface ReceivedItemsPacket extends BasePacket {
    readonly cmd: CommandPacketType.RECEIVED_ITEMS;
    readonly index: number;
    readonly items: NetworkItem[];
}
