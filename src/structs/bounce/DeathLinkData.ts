/**
 * The data for a special kind of {@link BouncePacket} that can be supported by any Archipelago game. It targets the tag
 * {@link CommonTags.DEATH_LINK} and carries the following data:
 */
export interface DeathLinkData {
    /** Unix Time Stamp of time of death. */
    time: number;

    /** Name of the player who first died. Can be a slot name, but can also be a name from within a multiplayer game. */
    source: string;

    /** Optional. Text to explain the cause of death, ex. "Phar was shot after making another pun." */
    cause?: string;
}
