import { APBaseObject } from "./__base";

export interface GameData extends APBaseObject {
    readonly item_name_to_id: { [name: string]: number };
    readonly location_name_to_id: { [name: string]: number };
    readonly version: number;
}