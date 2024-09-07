/**
 * A {@link DataPackage} is an object which contains arbitrary metadata about each game to enable a client to interact
 * with the Archipelago server easily.
 *
 * Note:
 * - Any `name` is unique to its type across its own Game only: Single Arrow can exist in two games.
 * - The `id`s from the game `Archipelago` may be used in any other game. Especially Location ID `-1`: `Cheat Console`
 * and `-2`: `Server` (typically Remote Start Inventory).
 * @internal
 */
export type DataPackage = {
    /** Mapping of all Games and their respective data. See {@link GamePackage} for additional info. */
    readonly games: { [game: string]: GamePackage }
};

/**
 * Collection of data that contains meta information for a particular game.
 * @internal
 */
export type GamePackage = {
    /** Mapping of all item names to their respective id. */
    readonly item_name_to_id: { [name: string]: number }

    /** Mapping of all location names to their respective id. */
    readonly location_name_to_id: { [name: string]: number }

    /** SHA1 checksum of this game's data. */
    readonly checksum: string
};
