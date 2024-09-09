/**
 * A textual node containing item metadata.
 * @see {@link JSONMessagePart} for all possible message part node subtypes.
 */
export type ItemJSONMessagePart = {
    /** Used to denote the intent of the message part. */
    readonly type: "item_id" | "item_name"

    /** Used to supply text data for this node. */
    readonly text: string

    /** Bit flags that determine if an item is progression, "nice to have", filler, or a trap. */
    readonly flags: number

    /** The `id` of the player who owns this item. */
    readonly player: number
};

/**
 * A textual node containing location metadata.
 * @see {@link JSONMessagePart} for all possible message part node subtypes.
 */
export type LocationJSONMessagePart = {
    /** Used to denote the intent of the message part. */
    readonly type: "location_id" | "location_name"

    /** Used to supply text data for this node. */
    readonly text: string

    /** The `id` of the player who has this location. */
    readonly player: number
};

/**
 * A textual node containing color metadata.
 * @see {@link JSONMessagePart} for all possible message part node subtypes.
 */
export type ColorJSONMessagePart = {
    /** Used to denote the intent of the message part. */
    readonly type: "color"

    /** Used to supply text data for this node. */
    readonly text: string

    /** Includes the color to print this text with. */
    readonly color: ValidJSONColorType
};

/**
 * A textual node containing plaintext metadata.
 * @see {@link JSONMessagePart} for all possible message part node subtypes.
 */
export type TextJSONMessagePart = {
    /**
     * Used to denote the intent of the message part.
     * @remarks If `type` is omitted, it should be treated as the `text` type.
     */
    readonly type?: "text" | "entrance_name" | "player_id" | "player_name"

    /** Used to supply text data for this node. */
    readonly text: string
};

/**
 * A union of all message node subtypes sent along with {@link NetworkPackets.PrintJSONPacket}, which can be
 * reconstructed into a legible message. Each node is intended to be read in the order provided in the packet.
 * @remarks See each subtype for more specific information.
 */
export type JSONMessagePart =
    | ItemJSONMessagePart
    | LocationJSONMessagePart
    | ColorJSONMessagePart
    | TextJSONMessagePart;

/**
 * This is a type union of all supported message types for denoting the intent of the message part. This can be used to
 * indicate special information which may be rendered differently depending on client.
 *
 * - `text`: Regular text content. This is also the default type and is often omitted.
 * - `player_id`: Player id of someone on your team, should be resolved to player Name.
 * - `player_name`: Player Name, could be a player within a multiplayer game or from another team, not id resolvable.
 * - `item_id`: Item id, should be resolved to an item name.
 * - `item_name`: Item name, not currently used over network, but supported by reference clients.
 * - `location_id`: Location id, should be resolved to a location name.
 * - `location_name`: Location name, not currently used over network, but supported by reference clients.
 * - `entrance_name`: Entrance name. No id mapping exists.
 * - `color`: Regular text that should be colored. Only type that will contain color data.
 */
export type ValidJSONMessagePartType =
    | "text"
    | "player_id"
    | "player_name"
    | "item_id"
    | "item_name"
    | "location_id"
    | "location_name"
    | "entrance_name"
    | "color";

/**
 * This is a type union of all supported "colors" denoting a console color to display the message part with and is only
 * sent if the `type` is `color`. This is limited to console colors due to backwards compatibility needs with games such
 * as `A Link to the Past`. Although background colors as well as foreground colors are listed, only one may be applied
 * to a {@link JSONMessagePart} at a time.
 */
export type ValidJSONColorType =
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
