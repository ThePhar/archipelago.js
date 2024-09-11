import { GamePackage } from "../api";
import { ArchipelagoClient } from "../structs/ArchipelagoClient.ts";

/**
 * Managers the data package and name lookup helper functions.
 */
export class DataPackageManager {
    readonly #client: ArchipelagoClient;
    readonly #packages: Record<string, PackageMetadata> = {};

    /**
     * Instantiates a new DataPackageManager.
     * @internal
     * @param client The Archipelago client associated with this manager.
     */
    public constructor(client: ArchipelagoClient) {
        this.#client = client;
    }
}

/**
 * A collection of metadata and helper methods for interacting with a game's data package.
 */
export class PackageMetadata {
    readonly #client: ArchipelagoClient;

    /** The name of the game this game package is for. */
    public readonly game: string;

    /** The SHA256 hexadecimal string representation of this game package. */
    public readonly checksum: string;

    /** A record of names to ids for all items in this game package. */
    public readonly itemTable: Readonly<Record<string, number>>;

    /** A record of names to ids for all locations in this game package. */
    public readonly locationTable: Readonly<Record<string, number>>;

    /** A record of ids to names for all items in this game package. */
    public readonly reverseItemTable: Readonly<Record<string, string>>;

    /** A record of ids to names for all locations in this game package. */
    public readonly reverseLocationTable: Readonly<Record<string, string>>;

    /**
     * Creates a new PackageMetadata.
     * @internal
     * @param client The Archipelago client that created this package.
     * @param game The name of the game for this game package.
     * @param _package The API-level game package to expand upon.
     */
    public constructor(client: ArchipelagoClient, game: string, _package: GamePackage) {
        this.#client = client;
        this.game = game;
        this.checksum = _package.checksum;
        this.itemTable = Object.freeze(_package.item_name_to_id);
        this.locationTable = Object.freeze(_package.location_name_to_id);
        this.reverseItemTable = Object.freeze(Object.fromEntries(Object
            .entries(this.itemTable)
            .map(([k, v]) => [v, k]),
        ));
        this.reverseLocationTable = Object.freeze(Object.fromEntries(Object
            .entries(this.locationTable)
            .map(([k, v]) => [v, k]),
        ));
    }

    /** Returns item name groups for this package from data storage API. */
    public get itemNameGroups(): Promise<Readonly<Record<string, string[]>>> {
        // Get key and locally cache for faster subsequent lookups.
        return this.#client.data.get([`_read_item_name_groups_${this.game}`], true) as Promise<Record<string, string[]>>;
    }

    /**
     * Returns location name groups for this package from the data storage API.
     */
    public get locationNameGroups(): Promise<Readonly<Record<string, string[]>>> {
        // Get key and locally cache for faster subsequent lookups.
        return this.#client.data.get([`_read_location_name_groups_${this.game}`], true) as Promise<Record<string, string[]>>;
    }

    /**
     * Lookup an item name by its id.
     * @param id The id of the item to name lookup.
     * @returns The item name or `undefined` if id does not exist in game package.
     */
    public findItemName(id: number): string | undefined {
        return this.reverseItemTable[id];
    }

    /**
     * Lookup a location name by its id.
     * @param id The id of the location to name lookup.
     * @returns The location name or `undefined` if id does not exist in game package.
     */
    public findLocationName(id: number): string | undefined {
        return this.reverseLocationTable[id];
    }

    /**
     * Returns a network-safe {@link GamePackage} that can be cached and preloaded ahead of time to reduce network load.
     */
    public exportGamePackage(): GamePackage {
        return {
            checksum: this.checksum,
            item_name_to_id: { ...this.itemTable },
            location_name_to_id: { ...this.locationTable },
        };
    }
}
