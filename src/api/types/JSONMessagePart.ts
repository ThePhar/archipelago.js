/** @internal */
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

/** @internal */
export type LocationJSONMessagePart = {
    /** Used to denote the intent of the message part. */
    readonly type: "location_id" | "location_name"

    /** Used to supply text data for this node. */
    readonly text: string

    /** The `id` of the player who has this location. */
    readonly player: number
};

/** @internal */
export type ColorJSONMessagePart = {
    /** Used to denote the intent of the message part. */
    readonly type: "color"

    /** Used to supply text data for this node. */
    readonly text: string

    /** Includes the color to print this text with. */
    readonly color: ValidJSONColorType
};

/** @internal */
export type MiscJSONMessagePart = {
    /** Used to denote the intent of the message part. */
    readonly type?: "text" | "entrance_name" | "player_id" | "player_name"

    /** Used to supply text data for this node. */
    readonly text: string
};

/**
 * Message nodes sent along with {@link PrintJSONPacket} to be reconstructed into a legible message. The nodes are
 * intended to be read in the order they are listed in the packet.
 * @internal
 */
export type JSONMessagePart =
    | ItemJSONMessagePart
    | LocationJSONMessagePart
    | ColorJSONMessagePart
    | MiscJSONMessagePart;

/**
 * This is a const of all supported message types for denoting the intent of the message part. This can be used to
 * indicate special information which may be rendered differently depending on client.
 *
 * - `text`: Regular text content. Is the default type and as such may be omitted.
 * - `player_id`: Player id of someone on your team, should be resolved to player Name.
 * - `player_name`: Player Name, could be a player within a multiplayer game or from another team, not id resolvable.
 * - `item_id`: Item id, should be resolved to an item name.
 * - `item_name`: Item name, not currently used over network, but supported by reference clients.
 * - `location_id`: Location id, should be resolved to a location name.
 * - `location_name`: Location name, not currently used over network, but supported by reference clients.
 * - `entrance_name`: Entrance name. No id mapping exists.
 * - `color`: Regular text that should be colored. Only type that will contain color data.
 * @internal
 */
export const enum ValidJSONMessagePartType {
    Text = "text",
    PlayerId = "player_id",
    PlayerName = "player_name",
    ItemId = "item_id",
    ItemName = "item_name",
    LocationId = "location_id",
    LocationName = "location_name",
    EntranceName = "entrance_name",
    Color = "color",
}

/**
 * This is a const of all supported "colors" denoting a console color to display the message part with and is only
 * sent if the `type` is `color`. This is limited to console colors due to backwards compatibility needs with games such
 * as `A Link to the Past`. Although background colors as well as foreground colors are listed, only one may be applied
 * to a {@link JSONMessagePart} at a time.
 * @internal
 */
export const enum ValidJSONColorType {
    // Yes, 'bold' and 'underline' are colors. Deal with it.
    Bold = "bold",
    Underline = "underline",

    Black = "black",
    Red = "red",
    Green = "green",
    Yellow = "yellow",
    Blue = "blue",
    Magenta = "magenta",
    Cyan = "cyan",
    White = "white",
    BlackBackground = "black_bg",
    RedBackground = "red_bg",
    GreenBackground = "green_bg",
    YellowBackground = "yellow_bg",
    BlueBackground = "blue_bg",
    PurpleBackground = "purple_bg",
    CyanBackground = "cyan_bg",
    WhiteBackground = "white_bg",
}
