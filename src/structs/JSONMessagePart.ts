import { ItemFlags } from "@enums";
import { APBaseObject } from "@structs";

/**
 * Message nodes sent along with {@link PrintJSONPacket} to be reconstructed into a legible message. The nodes are
 * intended to be read in the order they are listed in the packet.
 */
export interface JSONMessagePart extends APBaseObject {
    /** Used to denote the intent of the message part. */
    type?: ValidJSONMessageTypes;

    /** Used to supply text data for this node. */
    text?: string;

    /** Only available if `type` is a "color". */
    color?: ValidJSONColorTypes;

    /** Only available if `type` is an `item_id` or `item_name` */
    flags?: ItemFlags | number;

    /** Only available if `type` is either an item or location. */
    player?: number;
}

/**
 * This is a type union of all supported message types for denoting the intent of the message part. This can be used to
 * indicate special information which may be rendered differently depending on client.
 *
 * - `text`: Regular text content. Is the default type and as such may be omitted.
 * - `player_id`: player ID of someone on your team, should be resolved to Player Name.
 * - `player_name`: Player Name, could be a player within a multiplayer game or from another team, not ID resolvable.
 * - `item_id`: Item ID, should be resolved to Item Name.
 * - `item_name`: Item Name, not currently used over network, but supported by reference Clients.
 * - `location_id`: Location ID, should be resolved to Location Name.
 * - `location_name`: Location Name, not currently used over network, but supported by reference Clients.
 * - `entrance_name`: Entrance Name. No ID mapping exists.
 * - `color`: Regular text that should be colored. Only type that will contain color data.
 */
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

/**
 * This is a type union of all supported "colors" denoting a console color to display the message part with and is only
 * sent if the `type` is `color`. This is limited to console colors due to backwards compatibility needs with games such
 * as `A Link to the Past`. Although background colors as well as foreground colors are listed, only one may be applied
 * to a {@link JSONMessagePart} at a time.
 */
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
