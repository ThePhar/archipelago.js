/**
 *  A const of known containing the possible client states that may be used to inform the server during a status update.
 */
export const clientStatuses = {
    /**
     * Client is in an unknown or disconnected state. This status is set automatically initially and when all connected
     * clients have disconnected from the server.
     */
    disconnected: 0,

    /** Client is currently connected. This status is set automatically when a client connects. */
    connected: 5,

    /** Client is ready to start, but hasn't started playing yet. */
    ready: 10,

    /** Client is currently playing. */
    playing: 20,

    /** Client has completed their goal. Once set, cannot be changed. */
    goal: 30,
} as const;

/**
 * Bit flags that define the special characteristics of a {@link NetworkItem}.
 */
export const itemClassifications = {
    /** If set, indicates the item may unlock logical advancement. */
    progression: 0b001,

    /** If set, indicates the item is classified as useful to have. */
    useful: 0b010,

    /** If set, indicates the item can inconvenience a player. */
    trap: 0b100,

    /** A shorthand with no flags set, also known as 'filler' or 'junk' items. */
    normal: 0,
} as const;

/**
 * Bit flags configuring which items should be sent by the server to this client.
 */
export const itemsHandlingFlags = {
    /** Indicates the client only receives items created by cheat commands. */
    minimal: 0b000,

    /** Indicates the client get items sent from other worlds. */
    others: 0b001,

    /** Indicates the client get items sent from your own world. Requires `REMOTE_DIFFERENT_WORLDS` to be set. */
    own: 0b010,

    /** Indicates the client get your starting inventory sent. Requires `REMOTE_DIFFERENT_WORLDS` to be set. */
    starting: 0b100,

    /** Shorthand for `REMOTE_DIFFERENT_WORLDS`, `REMOTE_OWN_WORLD`, and `REMOTE_STARTING_INVENTORY`. */
    all: 0b111,
} as const;

/**
 * A const containing the possible command permissions, for commands that may be restricted.
 */
export const permissions = {
    /** Prevents players from using this command at any time. */
    disabled: 0,

    /** Allows players to use this command manually at any time. */
    enabled: 0b001,

    /** Allows players to use this command manually after they have completed their goal. */
    goal: 0b010,

    /**
     * Forces players to use this command after they have completed their goal.
     * @remarks Only allowed on `release` and `collect` permissions.
     */
    auto: 0b110,

    /**
     * Allows players to use this command manually at any time and forces them to use this command after they have
     * completed their goal.
     * @remarks Only allowed on `release` and `collect` permissions.
     */
    autoEnabled: 0b111,
} as const;

/**
 * An enumeration representing the nature of the slot.
 */
export const slotTypes = {
    /** This client is a spectator and not participating in the current game. */
    spectator: 0,

    /** This client is a player and is participating in the current game. */
    player: 1,

    /** This client is an item links group containing at least 1 player with active item links. */
    group: 2,
} as const;
