/**
 * The data for a special kind of {@link BouncePacket} that can be supported by any Archipelago game. It targets the tag
 * {@link CommonTags.DEATH_LINK} and carries the following data:
 */
export type DeathLinkData = {
    /** Unix time stamp of time of death in seconds. */
    time: number;

    /** Name of the player who first died. Can be a slot name, but can also be a name from within a multiplayer game. */
    source: string;

    /** Optional. Text to explain the cause of death, e.g. "Phar was shot after breaking core again." */
    cause?: string;
};
