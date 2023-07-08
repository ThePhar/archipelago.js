import { ObjectValues } from "../types/ObjectValues.ts";

/**
 * A const of known {@link PrintJSONPacket} types.
 */
export const PRINT_JSON_TYPE = {
    /** A player received an item. */
    ITEM_SEND: "ItemSend",

    /** A player used the `!getitem` command. */
    ITEM_CHEAT: "ItemCheat",

    /** A player hinted. */
    HINT: "Hint",

    /** A player connected. */
    JOIN: "Join",

    /** A player disconnected. */
    PART: "Part",

    /** A player sent a chat message. */
    CHAT: "Chat",

    /** The server broadcast a message. */
    SERVER_CHAT: "ServerChat",

    /** The client has triggered a tutorial message, such as when first connecting. */
    TUTORIAL: "Tutorial",

    /** A player changed their tags. */
    TAGS_CHANGED: "TagsChanged",

    /** Someone (usually the client) entered an `!` command. */
    COMMAND_RESULT: "CommandResult",

    /** The client entered an `!admin` command. */
    ADMIN_COMMAND_RESULT: "AdminCommandResult",

    /** A player reached their goal. */
    GOAL: "Goal",

    /** A player released the remaining items in their world. */
    RELEASE: "Release",

    /** A player collected the remaining items for their world. */
    COLLECT: "Collect",

    /** The current server countdown has progressed. */
    COUNTDOWN: "Countdown",
} as const;

export type PrintJSONType = ObjectValues<typeof PRINT_JSON_TYPE>;
