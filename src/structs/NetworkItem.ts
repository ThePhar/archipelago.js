import { ItemFlags } from "@enums";
import { APBaseObject } from "@structs";

export interface NetworkItem extends APBaseObject {
    readonly item: number;
    readonly location: number;
    readonly player: number;
    readonly flags: ItemFlags | number;
}
