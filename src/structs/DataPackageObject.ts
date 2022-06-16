import { APBaseObject, GameData } from "@structs";

/**
 * A {@link DataPackageObject} is an object which contains arbitrary metadata to enable a client to interact with the
 * Archipelago server most easily. Currently, this package is used to send ID to name mappings so that clients need not
 * maintain their own mappings.
 *
 * Note:
 * - Any ID is unique to its type across AP: Item 56 only exists once and Location 56 only exists once.
 * - Any Name is unique to its type across its own Game only: Single Arrow can exist in two games.
 * - The IDs from the game `Archipelago` may be used in any other game. Especially Location ID `-1`: `Cheat Console` and
 * `-2`: `Server` (typically Remote Start Inventory)
 */
export interface DataPackageObject extends APBaseObject {
    /** Mapping of all Games and their respective data. See {@link GameData} for additional info. */
    games: { [game: string]: GameData };
}
