/**
 * An object that contains information about a player on the network.
 * @internal
 */
export type NetworkPlayer = {
    /** Determines the team the player is on. Useful for competitive seeds. Team numbers start at `0`. */
    readonly team: number

    /**
     * Determines the slot id for this player. Slot numbers are unique per team and start at `1`. Slot number `0` refers
     * to the Archipelago server; this may appear in instances where the server grants the player an item.
     */
    readonly slot: number

    /**
     * Represents the player's name in current time. Can be changed during a game with the `!alias <name>` command by
     * the player.
     */
    readonly alias: string

    /**
     * The original slot name as defined by the player's configuration file. Individual names are unique among players.
     */
    readonly name: string
};