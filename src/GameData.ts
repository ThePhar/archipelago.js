/**
 * Dictionary that contains these keys and values. It's broken out into another "type" for ease of documentation.
 */
export interface GameData {
    /** Mapping of all item names to their respective ID. */
    item_name_to_id: { [name: string]: number };

    /** Mapping of all location names to their respective ID. */
    location_name_to_id: { [name: string]: number };

    /** Mapping of all item ids to their respective names. Inverse of `item_name_to_id`. */
    item_id_to_name: { [id: number]: string };

    /** Mapping of all location ids to their respective names. Inverse of `location_name_to_id`. */
    location_id_to_name: { [id: number]: string };

    /** Mapping of all item groups. */
    item_name_groups: { [group: string]: string[] };

    /** Mapping of all location groups. */
    location_name_groups: { [group: string]: string[] };

    /** Checksum of this game's data. Used to validate if cached data package needs to be updated. */
    checksum: string;
}
