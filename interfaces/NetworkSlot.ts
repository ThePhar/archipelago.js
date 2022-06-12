import { APBaseObject } from "./__base";
import { SlotType } from "../enums/SlotType";

export interface NetworkSlot extends APBaseObject {
    readonly name: string;
    readonly game: string;
    readonly type: SlotType;
    readonly group_members: number[];
}
