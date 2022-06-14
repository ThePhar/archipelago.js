import { SlotType } from "@enums";
import { APBaseObject } from "@structs";

export interface NetworkSlot extends APBaseObject {
    readonly name: string;
    readonly game: string;
    readonly type: SlotType;
    readonly group_members: number[];
}
