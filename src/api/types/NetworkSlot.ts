import { SlotType } from "../enums/SlotType.ts";

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

    /** The type of slot this is. See {@link SlotType} for additional information on allowed types. */
    readonly type: SlotType

    /**
     * Contains a list of player ids, if the `type` is {@link SlotType.Group}. Used for item links, otherwise empty.
     */
    readonly group_members: number[]
};
