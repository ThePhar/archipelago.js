import { DataPackage, GamePackage } from "../api";
import { ArchipelagoClient } from "../structs/ArchipelagoClient.ts";

/**
 * Managers the data package and name lookup helper functions.
 */
export class DataPackageManager {
    readonly #client: ArchipelagoClient;
    readonly #packages: Record<string, PackageMetadata> = {};
    #checksums: Record<string, string> = {};
    #games: string[] = [];

    /**
     * Instantiates a new DataPackageManager.
     * @internal
     * @param client The Archipelago client associated with this manager.
     */
    public constructor(client: ArchipelagoClient) {
        this.#client = client;

        this.#client.api.subscribe("onRoomInfo", (packet) => {
            this.#checksums = packet.datapackage_checksums;
            this.#games = packet.games;
        });

        // Preload AP 0.5.0 data package.
        this.#packages["Archipelago"] = this.#fetchCachedArchipelagoPackage();
    }

    /** Returns all loaded game packages. */
    public get packages(): Record<string, PackageMetadata> {
        return this.#packages;
    }

    /**
     * Fetch game packages from the server if they are not present locally or local checksum does not match the
     * server's.
     * @param games A list of game packages to fetch. If omitted, fetches all available game packages.
     * @remarks It is recommended to export and locally cache data packages after connecting and prior to next
     * connection, import the data package to reduce future DataPackage calls.
     *
     * Can also be automatically done via {@link ConnectionArguments} `fetchDataPackage` property prior to
     * authentication.
     */
    public async fetch(games?: string[]): Promise<void> {
        // Get all games in the current room if omitted.
        if (!games) {
            games = this.#games;
        }

        // Validate if any game packages even need to be updated to reduce bandwidth.
        games = games.reduce((requiredGames, game) => {
            // If game package doesn't exist in this room, then we definitely don't need it.
            if (!this.#games.includes(game)) {
                return requiredGames;
            }

            // If the game package isn't present locally, then we'll need it.
            if (!this.#packages[game]) {
                return [...requiredGames, game];
            }

            // If checksum does not match, then we'll need it.
            if (this.#packages[game].checksum !== this.#checksums[game]) {
                return [...requiredGames, game];
            }

            return requiredGames;
        }, [] as string[]);

        // Request each game individually to reduce likelihood of a gigantic DataPackage packet.
        for (const game of games) {
            await new Promise<void>((resolve) => {
                const unsubscribe = this.#client.api.subscribe("onDataPackage", (packet) => {
                    this.import(packet.data);
                    unsubscribe();
                    resolve();
                });

                this.#client.api.send({ cmd: "GetDataPackage", games: [game] });
            });
        }
    }

    /**
     * Export loaded data package as an object that can be loaded later (e.g., locally cache to reduce network calls to
     * fetch data package).
     * @example
     * // Node example
     * import fs from "fs";
     *
     * // ... misc code connecting and fetching data package.
     *
     * const data = client.package.export();
     * fs.writeFileSync("datapackage_cache.json", JSON.stringify(data), "utf8");
     */
    public export(): DataPackage {
        return {
            games: Object.entries(this.#packages).reduce((games, [game, _package]) => {
                games[game] = _package.exportGamePackage();
                return games;
            }, {} as Record<string, GamePackage>),
        };
    }

    /**
     * Import a data package to pre-populate local storage. Recommended to avoid unnecessary DataPackage calls over
     * the network (can be quite large in rooms with many different games).
     * @param dataPackage A data package to preload.
     * @example
     * // Node example
     * import fs from "fs";
     * import { ArchipelagoClient } from "@pharware/archipelago";
     *
     * const data = fs.readFileSync("datapackage_cache.json");
     * const client = new ArchipelagoClient();
     *
     * client.package.import(JSON.parse(data));
     * await client.connect("wss://archipelago.gg:38281");
     */
    public import(dataPackage: DataPackage): void {
        for (const game in dataPackage.games) {
            this.#packages[game] = new PackageMetadata(this.#client, game, dataPackage.games[game]);
        }
    }

    #fetchCachedArchipelagoPackage(): PackageMetadata {
        return new PackageMetadata(this.#client, "Archipelago", {
            checksum: "ac9141e9ad0318df2fa27da5f20c50a842afeecb",
            item_name_to_id: { Nothing: -1 },
            location_name_to_id: { "Cheat Console": -1, "Server": -2 },
        });
    };
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
