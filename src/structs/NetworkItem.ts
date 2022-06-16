import { ItemFlags } from "@enums";
import { APBaseObject } from "@structs";

/**
 * Items that are sent over the network.
 */
export interface NetworkItem extends APBaseObject {
    /** The item ID of the item. Item IDs are in the range of ± 2^53-1. */
    item: number;

    /** The location ID of the location inside the world. Location IDs are in the range of ± 2^53-1. */
    location: number;

    /**
     * The slot ID for the player who's world the item was located in, except when inside a {@link LocationInfoPacket},
     * then it will be the slot ID of the player the item belongs to.
     */
    player: number;

    /**
     * Bit flags for the type of item this is. See {@link ItemFlags} for additional information.
     */
    flags: ItemFlags | number;
}
