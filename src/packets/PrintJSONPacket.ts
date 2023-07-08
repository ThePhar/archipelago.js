import { PrintJSONType } from "../consts/PrintJSONType.ts";
import { JSONMessagePart } from "../types/JSONMessagePart.ts";
import { NetworkItem } from "../types/NetworkItem.ts";

export type ItemSendJSONPacket = {
    cmd: "PrintJSON";

    /** May be present to indicate the nature of this message. Known types are specified in {@link PrintJSONType}. */
    type: "ItemSend";

    /** All the data for this type of message. */
    data: JSONMessagePart[];

    /** Destination player's identifier. */
    receiving: number;

    /** Source player's identifier, location identifier, item identifier and item flags. */
    item: NetworkItem;
};

export type ItemCheatJSONPacket = {
    cmd: "PrintJSON";

    /** May be present to indicate the nature of this message. Known types are specified in {@link PrintJSONType}. */
    type: "ItemCheat";

    /** All the data for this type of message. */
    data: JSONMessagePart[];

    /** Destination player's identifier. */
    receiving: number;

    /** Source player's identifier, location identifier, item identifier and item flags. */
    item: NetworkItem;

    /** Team of the triggering player. */
    team: number;
};

export type HintJSONPacket = {
    cmd: "PrintJSON";

    /** May be present to indicate the nature of this message. Known types are specified in {@link PrintJSONType}. */
    type: "Hint";

    /** All the data for this type of message. */
    data: JSONMessagePart[];

    /** Destination player's identifier. */
    receiving: number;

    /** Source player's identifier, location identifier, item identifier and item flags. */
    item: NetworkItem;

    /** Whether the location hinted for was checked. */
    found: boolean;
};

export type JoinJSONPacket = {
    cmd: "PrintJSON";

    /** May be present to indicate the nature of this message. Known types are specified in {@link PrintJSONType}. */
    type: "Join";

    /** All the data for this type of message. */
    data: JSONMessagePart[];

    /** Team of the triggering player. */
    team: number;

    /** Slot of the triggering player. */
    slot: number;

    /** Tags of the triggering player. */
    tags: string[];
};

export type PartJSONPacket = {
    cmd: "PrintJSON";

    /** May be present to indicate the nature of this message. Known types are specified in {@link PrintJSONType}. */
    type: "Part";

    /** All the data for this type of message. */
    data: JSONMessagePart[];

    /** Team of the triggering player. */
    team: number;

    /** Slot of the triggering player. */
    slot: number;
};

export type ChatJSONPacket = {
    cmd: "PrintJSON";

    /** May be present to indicate the nature of this message. Known types are specified in {@link PrintJSONType}. */
    type: "Chat";

    /** All the data for this type of message. */
    data: JSONMessagePart[];

    /** Team of the triggering player. */
    team: number;

    /** Slot of the triggering player. */
    slot: number;

    /** Original chat message without sender prefix. */
    message: string;
};

export type ServerChatJSONPacket = {
    cmd: "PrintJSON";

    /** May be present to indicate the nature of this message. Known types are specified in {@link PrintJSONType}. */
    type: "ServerChat";

    /** All the data for this type of message. */
    data: JSONMessagePart[];

    /** Original chat message without sender prefix. */
    message: string;
};

export type TutorialJSONPacket = {
    cmd: "PrintJSON";

    /** May be present to indicate the nature of this message. Known types are specified in {@link PrintJSONType}. */
    type: "Tutorial";

    /** All the data for this type of message. */
    data: JSONMessagePart[];
};

export type TagsChangedJSONPacket = {
    cmd: "PrintJSON";

    /** May be present to indicate the nature of this message. Known types are specified in {@link PrintJSONType}. */
    type: "TagsChanged";

    /** All the data for this type of message. */
    data: JSONMessagePart[];

    /** Team of the triggering player. */
    team: number;

    /** Slot of the triggering player. */
    slot: number;

    /** Tags of the triggering player. */
    tags: string[];
};

export type CommandResultJSONPacket = {
    cmd: "PrintJSON";

    /** May be present to indicate the nature of this message. Known types are specified in {@link PrintJSONType}. */
    type: "CommandResult";

    /** All the data for this type of message. */
    data: JSONMessagePart[];
};

export type AdminCommandResultJSONPacket = {
    cmd: "PrintJSON";

    /** May be present to indicate the nature of this message. Known types are specified in {@link PrintJSONType}. */
    type: "AdminCommandResult";

    /** All the data for this type of message. */
    data: JSONMessagePart[];
};

export type GoalJSONPacket = {
    cmd: "PrintJSON";

    /** May be present to indicate the nature of this message. Known types are specified in {@link PrintJSONType}. */
    type: "Goal";

    /** All the data for this type of message. */
    data: JSONMessagePart[];

    /** Team of the triggering player. */
    team: number;

    /** Slot of the triggering player. */
    slot: number;
};

export type ReleaseJSONPacket = {
    cmd: "PrintJSON";

    /** May be present to indicate the nature of this message. Known types are specified in {@link PrintJSONType}. */
    type: "Release";

    /** All the data for this type of message. */
    data: JSONMessagePart[];

    /** Team of the triggering player. */
    team: number;

    /** Slot of the triggering player. */
    slot: number;
};

export type CollectJSONPacket = {
    cmd: "PrintJSON";

    /** May be present to indicate the nature of this message. Known types are specified in {@link PrintJSONType}. */
    type: "Collect";

    /** All the data for this type of message. */
    data: JSONMessagePart[];

    /** Team of the triggering player. */
    team: number;

    /** Slot of the triggering player. */
    slot: number;
};

export type CountdownJSONPacket = {
    cmd: "PrintJSON";

    /** May be present to indicate the nature of this message. Known types are specified in {@link PrintJSONType}. */
    type: "Countdown";

    /** All the data for this type of message. */
    data: JSONMessagePart[];

    /** Amount of seconds remaining on the countdown. */
    countdown: number;
};

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
