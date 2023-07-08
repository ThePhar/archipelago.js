/**
 * Bit flags configuring which items should be sent by the server.
 */
export enum ItemsHandlingFlags {
    /** No ReceivedItems is sent to you, ever. */
    LOCAL_ONLY = 0b000,

    /** Indicates you get items sent from other worlds. */
    REMOTE_DIFFERENT_WORLDS = 0b001,

    /** Indicates you get items sent from your own world. Requires `REMOTE_DIFFERENT_WORLDS` to be set. */
    REMOTE_OWN_WORLD = 0b010,

    /** Indicates you get your starting inventory sent. Requires `REMOTE_DIFFERENT_WORLDS` to be set. */
    REMOTE_STARTING_INVENTORY = 0b100,

    /** Shorthand for `REMOTE_DIFFERENT_WORLDS`, `REMOTE_OWN_WORLD`, and `REMOTE_STARTING_INVENTORY`. */
    REMOTE_ALL = 0b111,
}
