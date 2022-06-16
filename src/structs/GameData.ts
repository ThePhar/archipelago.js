import { APBaseObject } from "@structs";

/**
 * {@link GameData} is a dict but contains these keys and values. It's broken out into another "type" for ease of
 * documentation.
 */
export interface GameData extends APBaseObject {
    /** Mapping of all item names to their respective ID. */
    item_name_to_id: { [name: string]: number };

    /** Mapping of all location names to their respective ID. */
    location_name_to_id: { [name: string]: number };

    /** Version number of this game's data. */
    version: number;
}
