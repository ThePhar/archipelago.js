import { ItemFlags } from "../consts/ItemFlags";

/**
 * Items that are sent over the network.
 */
export type NetworkItem = {
    /** The item id of the item. Item ids are in the range of -2^53^ to +2^53^-1. */
    item: number;

    /** The location id of the location inside the world. Location ids are in the range of -2^53^ to +2^53^-1. */
    location: number;

    /**
     * The slot id for the player whose world the item was located in, except when inside a {@link LocationInfoPacket},
     * then it will be the slot id of the player the item belongs to.
     */
    player: number;

    /**
     * Bit flags for the type of item this is. See {@link ItemFlags} for additional information.
     */
    flags: ItemFlags | number;
};
