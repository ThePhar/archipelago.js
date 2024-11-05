import { Hint } from "../classes/Hint.ts";
import { Item } from "../classes/Item.ts";

/**
 * An interface with all supported item/hint events and their respective callback arguments. To be called from
 * {@link ItemsManager}.
 */
export type ItemEvents = {
    /**
     * Fired when items have been received.
     * @param items An array of item metadata in the order they are sent.
     * @param startingIndex The {@link ItemsManager.received} index for the first item in the `items` array.
     */
    itemsReceived: [items: Item[], startingIndex: number]

    /**
     * Fired when a new hint has been received.
     * @param hint The hint that has been created.
     */
    hintReceived: [hint: Hint]

    /**
     * Fired when a hint has been found.
     * @param hint The hint that has been found.
     */
    hintFound: [hint: Hint]

    /**
     * Fired shortly after initial connection with all current hints relevant to this player.
     * @param hints All hints ever created relevant to this player.
     */
    hintsInitialized: [hints: Hint[]]
};
