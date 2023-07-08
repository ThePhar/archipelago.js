import { Client } from "../index";

/**
 * Managers and watches for events regarding player data and provides helper functions to make working with players
 * easier.
 */
export class PlayersManager {
    #client: Client<unknown>;

    /**
     * Creates a new {@link PlayersManager} and sets up events on the {@link Client} to listen for to start
     * updating its internal state.
     *
     * @param client The {@link Client} that should be managing this manager.
     */
    public constructor(client: Client<unknown>) {
        this.#client = client;
    }

    /**
     * Returns the `name` of a given player `id`. Returns "Unknown Player #" if player does not exist in the room.
     *
     * Special cases:
     * - If player id is `0`, returns `Archipelago`.
     *
     * @param id The slot `id` of a player.
     *
     * @throws Throws an error if unable to find a player with the given `id`.
     */
    public name(id: number): string {
        if (id === 0) {
            return "Archipelago";
        }

        const name = this.#client.data.players.get(id)?.name;
        if (!name) {
            throw new Error(`Unable to find player by id: ${id}`);
        }

        return name;
    }

    /**
     * Returns the `alias` of a given player `id`. Returns "Unknown Player #" if player does not exist in the room.
     *
     * Special cases:
     * - If player id is `0`, returns `Archipelago`.
     *
     * @param id The slot `id` of a player.
     *
     * @throws Throws an error if unable to find a player with the given `id`.
     */
    public alias(id: number): string {
        if (id === 0) {
            return "Archipelago";
        }

        const alias = this.#client.data.players.get(id)?.alias;
        if (!alias) {
            throw new Error(`Unable to find player by id: ${id}`);
        }

        return alias;
    }

    /**
     * Returns the game name of a given player.
     *
     * Special cases:
     * - If player id is `0`, returns `Archipelago`.
     *
     * @param id The slot `id` of a player.
     *
     * @throws Throws an error if unable to find a player with the given `id`.
     */
    public game(id: number): string {
        if (id === 0) {
            return "Archipelago";
        }

        const game = this.#client.data.players.get(id)?.game;
        if (!game) {
            throw new Error(`Unable to find player by id: ${id}`);
        }

        return game;
    }

    /**
     * Returns an array of player `id`s in a specific group. Returns an empty array for non-{@link SlotType.GROUP}
     * members.
     *
     * @param id The slot `id` of a {@link SlotType.GROUP} player.
     */
    public members(id: number): number[] {
        const members = this.#client.data.players.get(id)?.group_members;
        if (!members) {
            return [];
        }

        return members;
    }
}
