/**
 * An enumeration of known {@link PrintJSONPacket} types.
 */
export enum PrintJSONType {
    /** Contains information regarding hint information for a player. */
    HINT = "Hint",

    /** Contains information regarding an item that was sent to a player. */
    ITEM_SEND = "ItemSend",
}
