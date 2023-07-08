import { PrintJSONType, ServerPacketType } from "../../enums";
import { JSONMessagePart, NetworkItem } from "../../structs";
import { ServerPacket } from "../index";

/**
 * Sent to clients purely to display a message to the player. While various message types provide additional arguments,
 * clients only need to evaluate the `data` argument to construct the human-readable message text. All other arguments
 * may be ignored safely.
 *
 * Only some of these attributes are present on {@link PrintJSONPacket} packets, see
 * [PrintJSON in AP Docs](https://github.com/ArchipelagoMW/Archipelago/blob/main/docs/network%20protocol.md#printjson)
 * for more information.
 *
 * @category Server Packets
 */
export interface BasePrintJSONPacket extends ServerPacket {
    cmd: ServerPacketType.PRINT_JSON;

    /** All the data for this type of message. */
    data: JSONMessagePart[];

    /** May be present to indicate the nature of this message. Known types are specified in {@link PrintJSONType}. */
    type: PrintJSONType;

    /** Destination player's identifier. */
    receiving?: number;

    /** Source player's identifier, location identifier, item identifier and item flags. */
    item?: NetworkItem;

    /** Whether the location hinted for was checked. */
    found?: boolean;

    /** Team of the triggering player. */
    team?: number;

    /** Slot of the triggering player. */
    slot?: number;

    /** Original chat message without sender prefix. */
    message?: string;

    /** Tags of the triggering player. */
    tags?: string[];

    /** Amount of seconds remaining on the countdown. */
    countdown?: number;
}

export interface ItemSendJSONPacket extends BasePrintJSONPacket {
    type: PrintJSONType.ITEM_SEND;

    receiving: number;

    item: NetworkItem;
}

export interface ItemCheatJSONPacket extends BasePrintJSONPacket {
    type: PrintJSONType.ITEM_CHEAT;

    receiving: number;

    item: NetworkItem;

    team: number;
}

export interface HintJSONPacket extends BasePrintJSONPacket {
    type: PrintJSONType.HINT;

    receiving: number;

    item: NetworkItem;

    found: boolean;
}

export interface JoinJSONPacket extends BasePrintJSONPacket {
    type: PrintJSONType.JOIN;

    team: number;

    slot: number;

    tags: string[];
}

export interface PartJSONPacket extends BasePrintJSONPacket {
    type: PrintJSONType.PART;

    team: number;

    slot: number;
}

export interface ChatJSONPacket extends BasePrintJSONPacket {
    type: PrintJSONType.CHAT;

    team: number;

    slot: number;

    message: string;
}

export interface ServerChatJSONPacket extends BasePrintJSONPacket {
    type: PrintJSONType.SERVER_CHAT;

    message: string;
}

export interface TutorialJSONPacket extends BasePrintJSONPacket {
    type: PrintJSONType.TUTORIAL;
}

export interface TagsChangedJSONPacket extends BasePrintJSONPacket {
    type: PrintJSONType.TAGS_CHANGED;

    team: number;

    slot: number;

    tags: string[];
}

export interface CommandResultJSONPacket extends BasePrintJSONPacket {
    type: PrintJSONType.COMMAND_RESULT;
}

export interface AdminCommandResultJSONPacket extends BasePrintJSONPacket {
    type: PrintJSONType.ADMIN_COMMAND_RESULT;
}

export interface GoalJSONPacket extends BasePrintJSONPacket {
    type: PrintJSONType.GOAL;

    team: number;

    slot: number;
}

export interface ReleaseJSONPacket extends BasePrintJSONPacket {
    type: PrintJSONType.RELEASE;

    team: number;

    slot: number;
}

export interface CollectJSONPacket extends BasePrintJSONPacket {
    type: PrintJSONType.COLLECT;

    team: number;

    slot: number;
}

export interface CountdownJSONPacket extends BasePrintJSONPacket {
    type: PrintJSONType.COUNTDOWN;

    countdown: number;
}

export type PrintJSONPacket =
    | ItemSendJSONPacket
    | ItemCheatJSONPacket
    | HintJSONPacket
    | JoinJSONPacket
    | PartJSONPacket
    | ChatJSONPacket
    | ServerChatJSONPacket
    | TutorialJSONPacket
    | TagsChangedJSONPacket
    | CommandResultJSONPacket
    | AdminCommandResultJSONPacket
    | GoalJSONPacket
    | ReleaseJSONPacket
    | CollectJSONPacket
    | CountdownJSONPacket;
