/**
 * Tags are represented as a list of strings, these are some of the most common tags.
 */
export enum CommonTags {
    /**
     * Signifies that this client is a reference client, its usefulness is mostly in debugging to compare client
     * behaviours more easily.
     */
    REFERENCE_CLIENT = "AP",

    /**
     * Deprecated. See {@link CommonTags.TRACKER} and {@link CommonTags.TEXT_ONLY}. Tells the server to ignore the
     * `game` attribute in the {@link ConnectPacket}.
     *
     * @deprecated
     */
    IGNORE_GAME = "IgnoreGame",

    /**
     * Client participates in the DeathLink mechanic, therefore will send and receive DeathLink {@link BouncePacket}s.
     */
    DEATH_LINK = "DeathLink",

    /**
     * Tells the server that this client will not send locations and is actually a Tracker. When specified and used with
     * an empty `game` in the {@link ConnectPacket}, `game` and `game`'s version validation will be skipped.
     */
    TRACKER = "Tracker",

    /**
     * Tells the server that this client will not send locations and is intended for chat. When specified and used with
     * an empty `game` in the {@link ConnectPacket}, `game` and `game`'s version validation will be skipped.
     */
    TEXT_ONLY = "TextOnly",
}
