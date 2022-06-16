import { SlotType } from "@enums";
import { APBaseObject } from "@structs";

/**
 * An object representing static information about a slot.
 */
export interface NetworkSlot extends APBaseObject {
    /**
     * The original slot name as defined by the player's configuration file. Individual names are unique among players.
     */
    name: string;

    /** The game this slot is playing. */
    game: string;

    /** The type of slot this is. See {@link SlotType} for additional information on allowed types. */
    type: SlotType;

    /**
     * Contains a list of player ids, if the `type` is {@link SlotType.GROUP}. Used for item links, otherwise empty.
     */
    group_members: number[];
}
