/**
 * An object representing a hint information for a particular item and location that contains it.
 * @internal
 */
export type NetworkHint = {
    /** The id of the player who owns this item. */
    readonly receiving_player: number

    /** The id of the player who has this item in their world. */
    readonly finding_player: number

    /** The id of the location for this item. */
    readonly location: number

    /** The id of this item. */
    readonly item: number

    /** Whether this item has already been found. */
    readonly found: boolean

    /** The name of the entrance to the location where this item is located. */
    readonly entrance: string

    /** The {@link ItemFlags} for this item. */
    readonly item_flags: number
};
