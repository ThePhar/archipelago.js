import { ObjectValues } from "../types/ObjectValues";

/**
 * Tags are represented as a list of strings, these are some of the most common tags.
 */
export const COMMON_TAGS = {
    /**
     * Signifies that this client is a reference client, its usefulness is mostly in debugging to compare client
     * behaviours more easily.
     *
     * **This tag should only be utilized by clients that come pre-packaged with Archipelago.**
     */
    REFERENCE_CLIENT: "AP",

    /**
     * Client participates in the DeathLink mechanic, therefore will send and receive DeathLink {@link BouncePacket}s.
     */
    DEATH_LINK: "DeathLink",

    /**
     * Tells the server that this client will not send locations and is actually a Tracker. When specified and used with
     * an empty `game` in the {@link ConnectPacket}, `game` and `game`'s version validation will be skipped.
     */
    TRACKER: "Tracker",

    /**
     * Tells the server that this client will not send locations and is intended for chat. When specified and used with
     * an empty `game` in the {@link ConnectPacket}, `game` and `game`'s version validation will be skipped.
     */
    TEXT_ONLY: "TextOnly",
} as const;

export type CommonTags = ObjectValues<typeof COMMON_TAGS>;
