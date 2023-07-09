import { ObjectValues } from "../types/ObjectValues";

/**
 * Bit flags that determine if an item is progression, "nice to have", filler, or a trap.
 */
export const ITEM_FLAGS = {
    /** Nothing special about this item. */
    FILLER: 0,

    /** If set, indicates the item can unlock logical advancement. */
    PROGRESSION: 0b001,

    /** If set, indicates the item is important but not in a way that unlocks advancement. */
    NEVER_EXCLUDE: 0b010,

    /** If set, indicates the item is a trap that can inconvenience the player. */
    TRAP: 0b100,
} as const;

export type ItemFlags = ObjectValues<typeof ITEM_FLAGS>;
