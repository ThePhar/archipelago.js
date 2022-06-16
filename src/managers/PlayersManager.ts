import { ArchipelagoClient } from "@core";

/**
 * Managers and watches for events regarding player data and provides helper functions to make working with players
 * easier.
 */
export class PlayersManager {
    private _client: ArchipelagoClient;

    /**
     * Creates a new {@link PlayersManager} and sets up events on the {@link ArchipelagoClient} to listen for to start
     * updating it's internal state.
     *
     * @param client The {@link ArchipelagoClient} that should be managing this manager.
     */
    public constructor(client: ArchipelagoClient) {
        this._client = client;
    }

    /**
     * Returns the `name` of a given player `id`. Returns "Unknown Player #" if player does not exist in the room.
     *
     * Special cases:
     * - If player id is `0`, returns `Archipelago`.
     *
     * @param playerId The slot id of a player.
     */
    public name(playerId: number): string {
        if (playerId === 0) return "Archipelago";

        return this._client.data.players.get(playerId)?.name ?? `Unknown Player ${playerId}`;
    }

    /**
     * Returns the `alias` of a given player `id`. Returns "Unknown Player #" if player does not exist in the room.
     *
     * Special cases:
     * - If player id is `0`, returns `Archipelago`.
     *
     * @param playerId The slot id of a player.
     */
    public alias(playerId: number): string {
        if (playerId === 0) return "Archipelago";

        return this._client.data.players.get(playerId)?.alias ?? `Unknown Player ${playerId}`;
    }
}
