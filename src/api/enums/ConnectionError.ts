/**
 * An enumeration of known errors the Archipelago server can send back to the client when they receive a
 * {@link ConnectionRefusedPacket}.
 * @internal
 */
export const enum ConnectionError {
    /** Indicates that the `name` field did not match any auth entry on the server. */
    InvalidSlot = "InvalidSlot",

    /** Indicates that a correctly named slot was found, but the game for it mismatched. */
    InvalidGame = "InvalidGame",

    /** Indicates a version mismatch or an unsupported client version number. */
    IncompatibleVersion = "IncompatibleVersion",

    /** Indicates the wrong, or no password when it was required, was sent. */
    InvalidPassword = "InvalidPassword",

    /** Indicates a wrong value type or bitflag items handling combination was sent. */
    InvalidItemsHandling = "InvalidItemsHandling",
}
