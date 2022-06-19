/**
 * Bit flags configuring which items should be sent by the server.
 */
export declare enum ItemsHandlingFlags {
    /** No ReceivedItems is sent to you, ever. */
    REMOTE_NONE = 0,
    /** Indicates you get items sent from other worlds. */
    REMOTE_DIFFERENT_WORLDS = 1,
    /** Indicates you get items sent from your own world. Requires `REMOTE_DIFFERENT_WORLDS` to be set. */
    REMOTE_OWN_WORLD = 2,
    /** Indicates you get your starting inventory sent. Requires `REMOTE_DIFFERENT_WORLDS` to be set. */
    REMOTE_STARTING_INVENTORY = 4,
    /** Shorthand for `REMOTE_DIFFERENT_WORLDS`, `REMOTE_OWN_WORLD`, and `REMOTE_STARTING_INVENTORY`. */
    REMOTE_ALL = 7
}
//# sourceMappingURL=ItemsHandlingFlags.d.ts.map