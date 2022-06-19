import { Client } from "../index";
/**
 * Managers and watches for events regarding player data and provides helper functions to make working with
 * players easier.
 */
export declare class PlayersManager {
    private _client;
    /**
     * Creates a new {@link PlayersManager} and sets up events on the {@link Client} to listen for to start
     * updating it's internal state.
     *
     * @param client The {@link Client} that should be managing this manager.
     */
    constructor(client: Client);
    /**
     * Returns the `name` of a given player `id`. Returns "Unknown Player #" if player does not exist in the room.
     *
     * Special cases:
     *
     * - If player id is `0`, returns `Archipelago`.
     *
     * @param playerId The slot id of a player.
     */
    name(playerId: number): string;
    /**
     * Returns the `alias` of a given player `id`. Returns "Unknown Player #" if player does not exist in the room.
     *
     * Special cases:
     *
     * - If player id is `0`, returns `Archipelago`.
     *
     * @param playerId The slot id of a player.
     */
    alias(playerId: number): string;
}
//# sourceMappingURL=PlayersManager.d.ts.map