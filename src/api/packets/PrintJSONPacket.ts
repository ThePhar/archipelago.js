import { ServerPacketType } from "../enums/CommandPacketTypes.ts";
import { JSONMessagePart } from "../types/JSONMessagePart.ts";
import { NetworkItem } from "../types/NetworkItem.ts";

/** @internal */
export interface ItemSendJSONPacket {
    readonly cmd: ServerPacketType.PrintJSON

    /** May be present to indicate the nature of this message. Known types are specified in {@link PRINT_JSON_TYPE}. */
    readonly type: "ItemSend"

    /** All the data for this type of message. */
    readonly data: JSONMessagePart[]

    /** Destination player's identifier. */
    readonly receiving: number

    /** Source player's identifier, location identifier, item identifier and item flags. */
    readonly item: NetworkItem
}

/** @internal */
export interface ItemCheatJSONPacket {
    readonly cmd: ServerPacketType.PrintJSON

    /** May be present to indicate the nature of this message. Known types are specified in {@link PRINT_JSON_TYPE}. */
    readonly type: "ItemCheat"

    /** All the data for this type of message. */
    readonly data: JSONMessagePart[]

    /** Destination player's identifier. */
    readonly receiving: number

    /** Source player's identifier, location identifier, item identifier and item flags. */
    readonly item: NetworkItem

    /** Team of the triggering player. */
    readonly team: number
}

/** @internal */
export interface HintJSONPacket {
    readonly cmd: ServerPacketType.PrintJSON

    /** May be present to indicate the nature of this message. Known types are specified in {@link PRINT_JSON_TYPE}. */
    readonly type: "Hint"

    /** All the data for this type of message. */
    readonly data: JSONMessagePart[]

    /** Destination player's identifier. */
    readonly receiving: number

    /** Source player's identifier, location identifier, item identifier and item flags. */
    readonly item: NetworkItem

    /** Whether the location hinted for was checked. */
    readonly found: boolean
}

/** @internal */
export interface JoinJSONPacket {
    readonly cmd: ServerPacketType.PrintJSON

    /** May be present to indicate the nature of this message. Known types are specified in {@link PRINT_JSON_TYPE}. */
    readonly type: "Join"

    /** All the data for this type of message. */
    readonly data: JSONMessagePart[]

    /** Team of the triggering player. */
    readonly team: number

    /** Slot of the triggering player. */
    readonly slot: number

    /** Tags of the triggering player. */
    readonly tags: string[]
}

/** @internal */
export interface PartJSONPacket {
    readonly cmd: ServerPacketType.PrintJSON

    /** May be present to indicate the nature of this message. Known types are specified in {@link PRINT_JSON_TYPE}. */
    readonly type: "Part"

    /** All the data for this type of message. */
    readonly data: JSONMessagePart[]

    /** Team of the triggering player. */
    readonly team: number

    /** Slot of the triggering player. */
    readonly slot: number
}

/** @internal */
export interface ChatJSONPacket {
    readonly cmd: ServerPacketType.PrintJSON

    /** May be present to indicate the nature of this message. Known types are specified in {@link PRINT_JSON_TYPE}. */
    readonly type: "Chat"

    /** All the data for this type of message. */
    readonly data: JSONMessagePart[]

    /** Team of the triggering player. */
    readonly team: number

    /** Slot of the triggering player. */
    readonly slot: number

    /** Original chat message without sender prefix. */
    readonly message: string
}

/** @internal */
export interface ServerChatJSONPacket {
    readonly cmd: ServerPacketType.PrintJSON

    /** May be present to indicate the nature of this message. Known types are specified in {@link PRINT_JSON_TYPE}. */
    readonly type: "ServerChat"

    /** All the data for this type of message. */
    readonly data: JSONMessagePart[]

    /** Original chat message without sender prefix. */
    readonly message: string
}

/** @internal */
export interface TutorialJSONPacket {
    readonly cmd: ServerPacketType.PrintJSON

    /** May be present to indicate the nature of this message. Known types are specified in {@link PRINT_JSON_TYPE}. */
    readonly type: "Tutorial"

    /** All the data for this type of message. */
    readonly data: JSONMessagePart[]
}

/** @internal */
export interface TagsChangedJSONPacket {
    readonly cmd: ServerPacketType.PrintJSON

    /** May be present to indicate the nature of this message. Known types are specified in {@link PRINT_JSON_TYPE}. */
    readonly type: "TagsChanged"

    /** All the data for this type of message. */
    readonly data: JSONMessagePart[]

    /** Team of the triggering player. */
    readonly team: number

    /** Slot of the triggering player. */
    readonly slot: number

    /** Tags of the triggering player. */
    readonly tags: string[]
}

/** @internal */
export interface CommandResultJSONPacket {
    readonly cmd: ServerPacketType.PrintJSON

    /** May be present to indicate the nature of this message. Known types are specified in {@link PRINT_JSON_TYPE}. */
    readonly type: "CommandResult"

    /** All the data for this type of message. */
    readonly data: JSONMessagePart[]
}

/** @internal */
export interface AdminCommandResultJSONPacket {
    readonly cmd: ServerPacketType.PrintJSON

    /** May be present to indicate the nature of this message. Known types are specified in {@link PRINT_JSON_TYPE}. */
    readonly type: "AdminCommandResult"

    /** All the data for this type of message. */
    readonly data: JSONMessagePart[]
}

/** @internal */
export interface GoalJSONPacket {
    readonly cmd: ServerPacketType.PrintJSON

    /** May be present to indicate the nature of this message. Known types are specified in {@link PRINT_JSON_TYPE}. */
    readonly type: "Goal"

    /** All the data for this type of message. */
    readonly data: JSONMessagePart[]

    /** Team of the triggering player. */
    readonly team: number

    /** Slot of the triggering player. */
    readonly slot: number
}

/** @internal */
export interface ReleaseJSONPacket {
    readonly cmd: ServerPacketType.PrintJSON

    /** May be present to indicate the nature of this message. Known types are specified in {@link PRINT_JSON_TYPE}. */
    readonly type: "Release"

    /** All the data for this type of message. */
    readonly data: JSONMessagePart[]

    /** Team of the triggering player. */
    readonly team: number

    /** Slot of the triggering player. */
    readonly slot: number
}

/** @internal */
export interface CollectJSONPacket {
    readonly cmd: ServerPacketType.PrintJSON

    /** May be present to indicate the nature of this message. Known types are specified in {@link PRINT_JSON_TYPE}. */
    readonly type: "Collect"

    /** All the data for this type of message. */
    readonly data: JSONMessagePart[]

    /** Team of the triggering player. */
    readonly team: number

    /** Slot of the triggering player. */
    readonly slot: number
}

/** @internal */
export interface CountdownJSONPacket {
    readonly cmd: ServerPacketType.PrintJSON

    /** May be present to indicate the nature of this message. Known types are specified in {@link PRINT_JSON_TYPE}. */
    readonly type: "Countdown"

    /** All the data for this type of message. */
    readonly data: JSONMessagePart[]

    /** Amount of seconds remaining on the countdown. */
    readonly countdown: number
}

/**
 * Sent to clients purely to display a message to the player. While various message types provide additional arguments,
 * clients only need to evaluate the `data` argument to construct the human-readable message text. All other arguments
 * may be ignored safely.
 *
 * Only some of these attributes are present on {@link PrintJSONPacket} packets, see
 * [PrintJSON in AP Docs](https://github.com/ArchipelagoMW/Archipelago/blob/main/docs/network%20protocol.md#printjson)
 * for more information.
 * @internal
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
