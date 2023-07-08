import { Client } from "../index";

/**
 * Manages and watches for events regarding item data and provides helper functions to make working with items easier.
 */
export class ItemsManager {
    #client: Client<unknown>;

    /**
     * Creates a new {@link ItemsManager} and sets up events on the {@link Client} to listen for to start
     * updating its internal state.
     *
     * @param client The {@link Client} that should be managing this manager.
     */
    public constructor(client: Client<unknown>) {
        this.#client = client;
    }

    /**
     * Returns the `name` of a given item `id`.
     *
     * @param game The `name` of the game this item belongs to.
     * @param id The `id` of this item.
     * @returns Returns the name of the item or `Unknown <Game> Item: <Id>` if item or game is not in data package.
     *
     * @throws Throws an error if `id` is not a safe integer.
     */
    public name(game: string, id: number): string {
        if (isNaN(id) || !Number.isSafeInteger(id)) {
            throw new Error(`'id' must be a safe integer. Received: ${id}`);
        }

        const gameData = this.#client.data.package.get(game);
        if (!gameData) {
            return `Unknown ${game} Item: ${id}`;
        }

        const name = gameData.item_id_to_name[id];
        if (!name) {
            return `Unknown ${game} Item: ${id}`;
        }

        return name;
    }

    /**
     * Returns the `id` of a given item `name`.
     *
     * @param game The `name` of the game this item belongs to.
     * @param name The `name` of this item.
     *
     * @throws Throws an error if unable to find the `id` for an item or unable to find game in data package.
     */
    public id(game: string, name: string): number {
        const gameData = this.#client.data.package.get(game);
        if (!gameData) {
            throw new Error(`Unknown game: ${game}`);
        }

        const id = gameData.item_name_to_id[name];
        if (!id) {
            throw new Error(`Unknown item name: ${name}`);
        }

        return id;
    }

    /**
     * Returns a list of all item names in a given group.
     *
     * @param game
     * @param name
     *
     * @throws Throws an error if unable to find game for group in data package.
     */
    public group(game: string, name: string): string[] {
        const gameData = this.#client.data.package.get(game);
        if (!gameData) {
            throw new Error(`Unknown game: ${game}`);
        }

        const group = gameData.item_name_groups[name];
        if (!group) {
            return [];
        }

        return group;
    }
}
