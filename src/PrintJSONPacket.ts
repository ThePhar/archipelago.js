import { ServerPacketType } from "./CommandPacketType.ts";
import { JSONMessagePart } from "./JSONMessagePart.ts";
import { PrintJSONType } from "./PrintJSONType.ts";
import { NetworkItem } from "./NetworkItem.ts";

export type ItemSendJSONPacket = {
    cmd: ServerPacketType.PRINT_JSON;

    /** All the data for this type of message. */
    data: JSONMessagePart[];

    /** May be present to indicate the nature of this message. Known types are specified in {@link PrintJSONType}. */
    type: PrintJSONType.ITEM_SEND;

    /** Destination player's identifier. */
    receiving: number;

    /** Source player's identifier, location identifier, item identifier and item flags. */
    item: NetworkItem;
}

export type ItemCheatJSONPacket = {
    cmd: ServerPacketType.PRINT_JSON;

    /** All the data for this type of message. */
    data: JSONMessagePart[];

    /** May be present to indicate the nature of this message. Known types are specified in {@link PrintJSONType}. */
    type: PrintJSONType.ITEM_CHEAT;

    /** Destination player's identifier. */
    receiving: number;

    /** Source player's identifier, location identifier, item identifier and item flags. */
    item: NetworkItem;

    /** Team of the triggering player. */
    team: number;
}

export type HintJSONPacket = {
    cmd: ServerPacketType.PRINT_JSON;

    /** All the data for this type of message. */
    data: JSONMessagePart[];

    /** May be present to indicate the nature of this message. Known types are specified in {@link PrintJSONType}. */
    type: PrintJSONType.HINT;

    /** Destination player's identifier. */
    receiving: number;

    /** Source player's identifier, location identifier, item identifier and item flags. */
    item: NetworkItem;

    /** Whether the location hinted for was checked. */
    found: boolean;
}

export type JoinJSONPacket = {
    cmd: ServerPacketType.PRINT_JSON;

    /** All the data for this type of message. */
    data: JSONMessagePart[];

    /** May be present to indicate the nature of this message. Known types are specified in {@link PrintJSONType}. */
    type: PrintJSONType.JOIN;

    /** Team of the triggering player. */
    team: number;

    /** Slot of the triggering player. */
    slot: number;

    /** Tags of the triggering player. */
    tags: string[];
}

export type PartJSONPacket = {
    cmd: ServerPacketType.PRINT_JSON;

    /** All the data for this type of message. */
    data: JSONMessagePart[];

    /** May be present to indicate the nature of this message. Known types are specified in {@link PrintJSONType}. */
    type: PrintJSONType.PART;

    /** Team of the triggering player. */
    team: number;

    /** Slot of the triggering player. */
    slot: number;
}

export type ChatJSONPacket = {
    cmd: ServerPacketType.PRINT_JSON;

    /** All the data for this type of message. */
    data: JSONMessagePart[];

    /** May be present to indicate the nature of this message. Known types are specified in {@link PrintJSONType}. */
    type: PrintJSONType.CHAT;

    /** Team of the triggering player. */
    team: number;

    /** Slot of the triggering player. */
    slot: number;

    /** Original chat message without sender prefix. */
    message: string;
}

export type ServerChatJSONPacket = {
    cmd: ServerPacketType.PRINT_JSON;

    /** All the data for this type of message. */
    data: JSONMessagePart[];

    /** May be present to indicate the nature of this message. Known types are specified in {@link PrintJSONType}. */
    type: PrintJSONType.SERVER_CHAT;

    /** Original chat message without sender prefix. */
    message: string;
}

export type TutorialJSONPacket = {
    cmd: ServerPacketType.PRINT_JSON;

    /** All the data for this type of message. */
    data: JSONMessagePart[];

    /** May be present to indicate the nature of this message. Known types are specified in {@link PrintJSONType}. */
    type: PrintJSONType.TUTORIAL;
}

export type TagsChangedJSONPacket = {
    cmd: ServerPacketType.PRINT_JSON;

    /** All the data for this type of message. */
    data: JSONMessagePart[];

    /** May be present to indicate the nature of this message. Known types are specified in {@link PrintJSONType}. */
    type: PrintJSONType.TAGS_CHANGED;

    /** Team of the triggering player. */
    team: number;

    /** Slot of the triggering player. */
    slot: number;

    /** Tags of the triggering player. */
    tags: string[];
}

export type CommandResultJSONPacket = {
    cmd: ServerPacketType.PRINT_JSON;

    /** All the data for this type of message. */
    data: JSONMessagePart[];

    /** May be present to indicate the nature of this message. Known types are specified in {@link PrintJSONType}. */
    type: PrintJSONType.COMMAND_RESULT;
}

export type AdminCommandResultJSONPacket = {
    cmd: ServerPacketType.PRINT_JSON;

    /** All the data for this type of message. */
    data: JSONMessagePart[];

    /** May be present to indicate the nature of this message. Known types are specified in {@link PrintJSONType}. */
    type: PrintJSONType.ADMIN_COMMAND_RESULT;
}

export type GoalJSONPacket = {
    cmd: ServerPacketType.PRINT_JSON;

    /** All the data for this type of message. */
    data: JSONMessagePart[];

    /** May be present to indicate the nature of this message. Known types are specified in {@link PrintJSONType}. */
    type: PrintJSONType.GOAL;

    /** Team of the triggering player. */
    team: number;

    /** Slot of the triggering player. */
    slot: number;
}

export type ReleaseJSONPacket = {
    cmd: ServerPacketType.PRINT_JSON;

    /** All the data for this type of message. */
    data: JSONMessagePart[];

    /** May be present to indicate the nature of this message. Known types are specified in {@link PrintJSONType}. */
    type: PrintJSONType.RELEASE;

    /** Team of the triggering player. */
    team: number;

    /** Slot of the triggering player. */
    slot: number;
}

export type CollectJSONPacket = {
    cmd: ServerPacketType.PRINT_JSON;

    /** All the data for this type of message. */
    data: JSONMessagePart[];

    /** May be present to indicate the nature of this message. Known types are specified in {@link PrintJSONType}. */
    type: PrintJSONType.COLLECT;

    /** Team of the triggering player. */
    team: number;

    /** Slot of the triggering player. */
    slot: number;
}

export type CountdownJSONPacket = {
    cmd: ServerPacketType.PRINT_JSON;

    /** All the data for this type of message. */
    data: JSONMessagePart[];

    /** May be present to indicate the nature of this message. Known types are specified in {@link PrintJSONType}. */
    type: PrintJSONType.COUNTDOWN;

    /** Amount of seconds remaining on the countdown. */
    countdown: number;
}

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
