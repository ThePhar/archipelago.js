/**
 * An enumeration of known errors the Archipelago can send back to the client when they receive a
 * {@link ConnectionRefusedPacket}.
 */
export enum ConnectionError {
    /** Indicates that the sent `name` field did not match any auth entry on the server. */
    INVALID_SLOT = "InvalidSlot",

    /** Indicates that a correctly named slot was found, but the game for it mismatched. */
    INVALID_GAME = "InvalidGame",

    /** Indicates a version mismatch or an unsupported client version number. */
    INCOMPATIBLE_VERSION = "IncompatibleVersion",

    /** Indicates the wrong, or no password when it was required, was sent. */
    INVALID_PASSWORD = "InvalidPassword",

    /** Indicates a wrong value type or flag combination was sent. */
    INVALID_ITEMS_HANDLING = "InvalidItemsHandling",
}
