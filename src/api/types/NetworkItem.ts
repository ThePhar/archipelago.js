/**
 * Items that are sent over the network.
 */
export type NetworkItem = {
    /** The item id of the item. Item ids are in the range of -2^53 to +2^53-1. */
    readonly item: number

    /** The location id of the location inside the world. Location ids are in the range of -2^53 to +2^53 - 1. */
    readonly location: number

    /**
     * The slot id for the player whose world the item was located in, except when inside a
     * {@link NetworkPackets.LocationInfoPacket}, then it will be the slot id of the player the item belongs to.
     */
    readonly player: number

    /** The {@link ItemsHandlingFlags} bit flags for this item. */
    readonly flags: number
};
