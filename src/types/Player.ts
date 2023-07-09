import { NetworkPlayer } from "./NetworkPlayer";
import { NetworkSlot } from "./NetworkSlot";

/**
 * An object that contains information about a player. Combination of {@link NetworkPlayer}, {@link NetworkSlot} and
 * some helper functions.
 */
export type Player = NetworkPlayer &
    NetworkSlot & {
        /** Helper function for looking up an item name for this player. */
        item: (id: number) => string;

        /** Helper function for looking up a location name for this player. */
        location: (id: number) => string;
    };
