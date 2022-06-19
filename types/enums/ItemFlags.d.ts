/**
 * Bit flags that determine if an item is progression, nice to have, filler, or a trap.
 */
export declare enum ItemFlags {
    /** Nothing special about this item. */
    FILLER = 0,
    /** If set, indicates the item can unlock logical advancement. */
    PROGRESSION = 1,
    /** If set, indicates the item is important but not in a way that unlocks advancement. */
    NEVER_EXCLUDE = 2,
    /** If set, indicates the item is a trap that can inconvenience the player. */
    TRAP = 4
}
//# sourceMappingURL=ItemFlags.d.ts.map