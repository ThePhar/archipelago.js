/**
 * A const of known {@link PrintJSONPacket} types.
 * @internal
 */
export const enum PrintJSONType {
    /** A player received an item. */
    ItemSend = "ItemSend",

    /** A player used the `!getitem` command. */
    ItemCheat = "ItemCheat",

    /** A player hinted. */
    NetworkHint = "NetworkHint",

    /** A player connected. */
    Join = "Join",

    /** A player disconnected. */
    Part = "Part",

    /** A player sent a chat message. */
    Chat = "Chat",

    /** The server broadcast a message. */
    ServerChat = "ServerChat",

    /** The client has triggered a tutorial message, such as when first connecting. */
    Tutorial = "Tutorial",

    /** A player changed their tags. */
    TagsChanged = "TagsChanged",

    /** Someone (usually the client) entered an `!` command. */
    CommandResult = "CommandResult",

    /** The client entered an `!admin` command. */
    AdminCommandResult = "AdminCommandResult",

    /** A player reached their goal. */
    Goal = "Goal",

    /** A player released the remaining items in their world. */
    Release = "Release",

    /** A player collected the remaining items for their world. */
    Collect = "Collect",

    /** The current server countdown has progressed. */
    Countdown = "Countdown",
}
