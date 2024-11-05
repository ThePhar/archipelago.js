import { permissions, slotTypes } from "./constants.ts";

/**
 * A union of known errors the Archipelago server can send back to the client when they receive a
 * {@link ConnectionRefusedPacket}.
 */
export type ConnectionError =
    | "InvalidSlot"
    | "InvalidGame"
    | "IncompatibleVersion"
    | "InvalidPassword"
    | "InvalidItemsHandling";

/**
 * A {@link DataPackage} is an object which contains arbitrary metadata about each game to enable a client to interact
 * with the Archipelago server easily.
 *
 * Note:
 * - Any `name` is unique to its type across its own Game only: Single Arrow can exist in two games.
 * - The `id`s from the game `Archipelago` may be used in any other game. Especially Location ID `-1`: `Cheat Console`
 * and `-2`: `Server` (typically Remote Start Inventory).
 */
export type DataPackage = {
    /** Mapping of all Games and their respective data. See {@link GamePackage} for additional info. */
    readonly games: Record<string, GamePackage>
};

/**
 * Collection of data that contains meta information for a particular game.
 */
export type GamePackage = {
    /** Mapping of all item names to their respective id. */
    readonly item_name_to_id: Record<string, number>

    /** Mapping of all location names to their respective id. */
    readonly location_name_to_id: Record<string, number>

    /** SHA1 checksum of this game's data. */
    readonly checksum: string
};

/** A type union of all basic JSON-compatible types. */
export type JSONSerializable =
    | string
    | number
    | boolean
    | null
    | JSONRecord
    | JSONSerializable[];

/** A record of JSON-serializable data. */
export type JSONRecord = { [p: string]: JSONSerializable };

/**
 * An object representing a hint information for a particular item and location that contains it.
 */
export type NetworkHint = {
    /** The id of the player who owns this item. */
    readonly receiving_player: number

    /** The id of the player who has this item in their world. */
    readonly finding_player: number

    /** The id of the location for this item. */
    readonly location: number

    /** The id of this item. */
    readonly item: number

    /** Whether this item has already been found. */
    readonly found: boolean

    /** The name of the entrance to the location where this item is located. */
    readonly entrance: string

    /** The classification bit flags for this item. See {@link itemsHandlingFlags} for known flags. */
    readonly item_flags: number
};

/**
 * Items that are sent over the network.
 */
export type NetworkItem = {
    /** The item id of the item. Item ids are in the range of -2^53 to +2^53-1. */
    readonly item: number

    /** The location id of the location inside the world. Location ids are in the range of -2^53 to +2^53 - 1. */
    readonly location: number

    /**
     * The slot id for the player whose world the item was located in, except when inside a {@link LocationInfoPacket},
     * then it will be the slot id of the player the item belongs to.
     */
    readonly player: number

    /** The classification bit flags for this item. See {@link itemsHandlingFlags} for known flags. */
    readonly flags: number
};

/**
 * An object that contains metadata about an individual player on the network.
 */
export type NetworkPlayer = {
    /** Determines the team the player is on. Useful for competitive seeds. Team numbers start at `0`. */
    readonly team: number

    /**
     * Determines the slot id for this player. Slot numbers are unique per team and start at `1`. Slot number `0` refers
     * to the Archipelago server; this may appear in instances where the server grants the player an item.
     */
    readonly slot: number

    /**
     * Represents the player's name in current time. Can be changed during a game with the `!alias <name>` command by
     * the player.
     */
    readonly alias: string

    /**
     * The original slot name as defined by the player's configuration file. Individual names are unique among players.
     */
    readonly name: string
};

/**
 * An object representing metadata about a given slot on each team.
 */
export type NetworkSlot = {
    /**
     * The original slot name as defined by the player's configuration file. Individual names are unique among players.
     */
    readonly name: string

    /** The game this slot is playing. */
    readonly game: string

    /** The type of slot this is. See {@link slotTypes} for known slot types. */
    readonly type: typeof slotTypes[keyof typeof slotTypes]

    /**
     * Contains a list of player ids, if the `type` is {@link slotTypes.group}. Used for item links, otherwise empty.
     */
    readonly group_members: number[]
};

/**
 * An object representing software versioning. Used in the {@link ConnectPacket} to allow the client to inform the
 * server the minimum Archipelago version it supports.
 * @remarks Archipelago does not follow a semver versioning standard.
 */
export type NetworkVersion = {
    /** Apparently required to be present to ensure the Archipelago server parses this object correctly. */
    readonly class: "Version"

    /** The major component of the version number. (e.g., X.0.0) */
    readonly major: number
    /** The minor component of the version number. (e.g., 0.X.0) */
    readonly minor: number
    /** The build/patch component of the version number. (e.g., 0.0.X) */
    readonly build: number
};

/** The type for a given permission value. */
export type PermissionValue = typeof permissions[keyof typeof permissions];

/** Mapping of restrict-able commands to their current {@link permissions} level. */
export type PermissionTable = {
    /**
     * Dictates what is allowed when it comes to a player releasing their run. A release is an action which
     * distributes the rest of the items in a player's run to those other players awaiting them.
     *
     * - {@link permissions.auto}: Distributes a player's items to other players when they complete their goal.
     * - {@link permissions.enabled}: Denotes that players may `!release` at any time in the game.
     * - {@link permissions.autoEnabled}: Both of the above options together.
     * - {@link permissions.disabled}: All forfeit modes disabled.
     * - {@link permissions.goal}: Allows for manual use of `!release` command once a player completes their
     * goal (disabled until goal completion).
     */
    readonly release: PermissionValue

    /**
     * Dictates what is allowed when it comes to a player collecting their run. A collect is an action which sends
     * the rest of the items in a player's run.
     *
     * - {@link permissions.auto}: Automatically when they complete their goal.
     * - {@link permissions.enabled}: Denotes that players may `!collect` at any time in the game.
     * - {@link permissions.autoEnabled}: Both of the above options together.
     * - {@link permissions.disabled}: All collect modes disabled.
     * - {@link permissions.goal}: Allows for manual use of `!collect` command once a player completes their
     * goal (disabled until goal completion).
     */
    readonly collect: PermissionValue

    /**
     * Dictates what is allowed when it comes to a player querying the items remaining in their run.
     *
     * - {@link permissions.goal}: Allows a player to query for items remaining in their run but only after they
     * completed their own goal.
     * - {@link permissions.enabled}: Denotes that players may query for any items remaining in their run (even
     * those belonging to other players).
     * - {@link permissions.disabled}: All remaining item query modes disabled.
     * @remarks This command cannot have the {@link permissions.auto} or {@link permissions.autoEnabled} permission.
     */
    readonly remaining: Omit<PermissionValue, typeof permissions.auto | typeof permissions.autoEnabled>
};
