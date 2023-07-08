/**
 * Collection of data that contains meta information for a particular game.
 */
export type GamePackage = {
    /** Mapping of all item names to their respective id. */
    item_name_to_id: { [name: string]: number };

    /** Mapping of all location names to their respective id. */
    location_name_to_id: { [name: string]: number };

    /**
     * Mapping of all item ids to their respective names. Inverse of `item_name_to_id`. This is not sent by the
     * Archipelago server, but is built by {@link DataManager} when it loads the data package.
     */
    item_id_to_name: { [id: number]: string };

    /**
     * Mapping of all location ids to their respective names. Inverse of `location_name_to_id`. This is not sent by the
     * Archipelago server, but is built by {@link DataManager} when it loads the data package.
     */
    location_id_to_name: { [id: number]: string };

    /** Mapping of all item groups. */
    item_name_groups: { [group: string]: string[] };

    /** Mapping of all location groups. */
    location_name_groups: { [group: string]: string[] };

    /**
     * SHA1 checksum of this game's data. Used to validate if cached data package needs to be requested from the server.
     */
    checksum: string;
};
