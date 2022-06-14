import { ItemFlags } from "@enums";
import { APBaseObject } from "@structs";

export interface JSONMessagePart extends APBaseObject {
    readonly type?: ValidJSONMessageTypes;
    readonly text?: string;
    readonly color?: ValidJSONColorTypes;
    readonly flags?: ItemFlags | number;
    readonly player?: number;
}

export type ValidJSONMessageTypes =
    | "text"
    | "player_id"
    | "player_name"
    | "item_id"
    | "item_name"
    | "location_id"
    | "location_name"
    | "entrance_name"
    | "color";

export type ValidJSONColorTypes =
    | "bold"
    | "underline"
    | "black"
    | "red"
    | "green"
    | "yellow"
    | "blue"
    | "magenta"
    | "cyan"
    | "white"
    | "black_bg"
    | "red_bg"
    | "green_bg"
    | "yellow_bg"
    | "blue_bg"
    | "purple_bg"
    | "cyan_bg"
    | "white_bg";
