import { APBaseObject } from "./__base";
import { ItemFlags } from "../enums/ItemFlags";

export interface NetworkItem extends APBaseObject {
    readonly item: number;
    readonly location: number;
    readonly player: number;
    readonly flags: ItemFlags | number;
}
