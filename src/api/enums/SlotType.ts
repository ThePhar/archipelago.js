/**
 * An enumeration representing the nature of the slot.
 * @internal
 */
export const enum SlotType {
    /** This client is a spectator and not participating in the current game. */
    Spectator = 0,

    /** This client is a player and is participating in the current game. */
    Player = 1,

    /** This client is an item links group containing at least 1 player with active item links. */
    Group = 2,
}
