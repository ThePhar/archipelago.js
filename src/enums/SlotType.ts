/**
 * An enumeration representing the nature of the slot.
 */
export enum SlotType {
    /** This client is a spectator and not participating in the current game. */
    SPECTATOR = 0b00,

    /** This client is a player and is participating in the current game. */
    PLAYER = 0b01,

    /** This client is an item links group containing at least 1 player with active item links. */
    GROUP = 0b10,
}
