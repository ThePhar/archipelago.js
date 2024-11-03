import { DataPackage, GamePackage, GetDataPackagePacket } from "../api";
import { Client } from "../client.ts";

/**
 * Managers data packages metadata and exposes name lookup methods.
 */
export class DataPackageManager {
    readonly #client: Client;
    readonly #packages: Map<string, PackageMetadata> = new Map();
    readonly #checksums: Map<string, string> = new Map();
    readonly #games: Set<string> = new Set();

    /**
     * Instantiates a new DataPackageManager. Should only be instantiated by creating a new {@link Client}.
     * @internal
     * @param client The client object this manager is associated with.
     */
    public constructor(client: Client) {
        this.#client = client;
        this.#client.socket.on("RoomInfo", (packet) => {
            this.#packages.clear();
            this.#checksums.clear();
            this.#games.clear();

            this.#packages.set("Archipelago", this.preloadArchipelago());
            for (const game in packet.datapackage_checksums) {
                this.#checksums.set(game, packet.datapackage_checksums[game]);
                this.#games.add(game);
            }
        });
    }

    /**
     * Returns the package metadata helper object for a specified game. If game package does not exist in cache, returns
     * `null` instead.
     * @param game The specific game package to look up.
     */
    public findPackage(game: string): PackageMetadata | null {
        return this.#packages.get(game) ?? null;
    }

    /**
     * Fetches and returns the {@link DataPackage} from the server, if the games are not locally cached or checksums
     * do not match.
     * @param games A list of game packages to fetch. If omitted, will fetch all available game packages from the
     * current room.
     * @param update If `true`, after fetching the data package, any changes will automatically be updated without
     * needing to manually call {@link DataPackageManager.importPackage}.
     * @remarks It is recommended to export and locally cache the data package after fetching, then prior to any future
     * connections, importing the locally cached package to reduce unnecessary network bandwidth.
     *
     * Any requested games that do not exist in the current room will be ignored.
     */
    public async fetchPackage(games: string[] = [], update = true): Promise<DataPackage> {
        // If an empty array was provided, get all games in current room.
        if (games.length === 0) {
            games = Array.from(this.#games);
        }

        // Ignore any game packages with checksums that match cached version (to save network bandwidth).
        games = games.filter((game) => {
            // Game doesn't exist in this room, so it's definitely not needed.
            if (!this.#games.has(game)) return false;

            // Mismatched checksums (or no cached data package), it will be required.
            if (this.#packages.get(game)?.checksum !== this.#checksums.get(game)) return true;

            // Any other situation, it's not needed.
            return false;
        });

        // Request each game individually to reduce likelihood of a large packet causing a spike in network usage.
        const data: DataPackage = { games: {} };
        for (const game of games) {
            const request: GetDataPackagePacket = { cmd: "GetDataPackage", games: [game] };
            const [response] = await this.#client.socket
                .send(request)
                .wait("DataPackage");

            data.games[game] = response.data.games[game];
        }

        if (update) {
            this.importPackage(data);
        }

        return data;
    }

    /**
     * Import a {@link DataPackage} object to prepopulate local cache.
     * @param dataPackage The package to import.
     * @remarks It is recommended to export/import any data packages ahead of time to reduce unnecessary calls to
     * {@link DataPackageManager.fetchPackage} and reduce connection startup time and lighten network overhead. See
     * below for an example.
     * @example <caption>Node.js</caption>
     * import fs from "node:fs";
     * import { Client } from "archipelago.js";
     *
     * const data = fs.readFileSync("path/to/cache/datapackage_cache.json");
     * const client = new Client();
     *
     * client.package.importPackage(JSON.parse(data));
     * await client.login("wss://archipelago.gg:38281", "Phar", "Clique");
     * @example <caption>Modern browser (using localStorage and ES-syntax)</caption>
     * <script src="archipelago.js" type="module">
     *     import { Client } from "archipelago.js";
     *
     *     const data = localStorage.getItem("datapackage_cache");
     *     const client = new Client();
     *
     *     client.package.importPackage(JSON.parse(data));
     *     await client.login("wss://archipelago.gg:38281", "Phar", "Clique");
     * </script>
     */
    public importPackage(dataPackage: DataPackage): void {
        for (const game in dataPackage.games) {
            this.#packages.set(game, new PackageMetadata(this.#client, game, dataPackage.games[game]));
            this.#checksums.set(game, dataPackage.games[game].checksum);
        }
    }

    /**
     * Export a {@link DataPackage} object for local caching purposes.
     * @remarks It is recommended to export/import any data packages ahead of time to reduce unnecessary calls to
     * {@link DataPackageManager.fetchPackage} and reduce connection startup time and lighten network overhead. See
     * below for an example.
     * @example <caption>Node.js</caption>
     * import fs from "node:fs";
     * import { Client } from "archipelago.js";
     *
     * // ... misc client code (connecting and fetching data package).
     *
     * // Save data package to a local file.
     * const data = client.package.exportPackage();
     * fs.writeFileSync("path/to/cache/datapackage_cache.json", JSON.stringify(data), "utf8");
     */
    public exportPackage(): DataPackage {
        return {
            games: this.#packages.entries().reduce((games, [game, pkg]) => {
                games[game] = pkg.exportPackage();
                return games;
            }, {} as Record<string, GamePackage>),
        };
    }

    /**
     * Returns preloaded data (i.e., Archipelago data package, since it's always available).
     * @private
     * @remarks If updates to the AP game package happen, this should be updated.
     */
    private preloadArchipelago(): PackageMetadata {
        // As of AP 0.5.0
        return new PackageMetadata(this.#client, "Archipelago", {
            checksum: "ac9141e9ad0318df2fa27da5f20c50a842afeecb",
            item_name_to_id: { Nothing: -1 },
            location_name_to_id: { "Cheat Console": -1, "Server": -2 },
        });
    }
}

/**
 * An abstraction of a {@link GamePackage} object which includes additional helper methods for interacting with a game's
 * package.
 */
export class PackageMetadata {
    readonly #client: Client;

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
     * Creates a new PackageMetadata from a given {@link GamePackage}.
     * @internal
     * @param client The Archipelago client that created this package.
     * @param game The name of the game for this game package.
     * @param _package The API-level game package to expand upon.
     */
    public constructor(client: Client, game: string, _package: GamePackage) {
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

    // TODO: Need to implement DataStorage API again.
    // /** Returns item name groups for this package from data storage API. */
    // public get itemNameGroups(): Promise<Readonly<Record<string, string[]>>> {
    //     // Get key and locally cache for faster subsequent lookups.
    //     return this.#client.data.get([`_read_item_name_groups_${this.game}`], true) as Promise<Record<string, string[]>>;
    // }

    // /**
    //  * Returns location name groups for this package from the data storage API.
    //  */
    // public get locationNameGroups(): Promise<Readonly<Record<string, string[]>>> {
    //     // Get key and locally cache for faster subsequent lookups.
    //     return this.#client.data.get([`_read_location_name_groups_${this.game}`], true) as Promise<Record<string, string[]>>;
    // }

    /**
     * Lookup an item name by its integer id.
     * @param id The id of the item to name lookup.
     * @param fallback If `true`, returns `"Unknown Item {id}"` instead of `undefined`, if id does not exist in package.
     * Defaults to `true`, if omitted.
     */
    public findItemName(id: number, fallback: true): string;

    /**
     * Lookup an item name by its integer id.
     * @param id The id of the item to name lookup.
     * @param fallback If `true`, returns `"Unknown Item {id}"` instead of `undefined`, if id does not exist in package.
     * Defaults to `true`, if omitted.
     */
    public findItemName(id: number, fallback: false): string | undefined;

    public findItemName(id: number, fallback: boolean = true): string | undefined {
        const name = this.reverseItemTable[id];
        if (fallback && name === undefined) {
            return `Unknown Item ${id}`;
        }

        return name;
    }

    /**
     * Lookup a location name by its integer id.
     * @param id The id of the location to name lookup.
     * @param fallback If `true`, returns `"Unknown Location {id}"` instead of `undefined`, if id does not exist in
     * package. Defaults to `true`, if omitted.
     */
    public findLocationName(id: number, fallback: true): string;

    /**
     * Lookup a location name by its integer id.
     * @param id The id of the location to name lookup.
     * @param fallback If `true`, returns `"Unknown Location {id}"` instead of `undefined`, if id does not exist in
     * package. Defaults to `true`, if omitted.
     */
    public findLocationName(id: number, fallback: false): string | undefined;

    public findLocationName(id: number, fallback: boolean = true): string | undefined {
        const name = this.reverseLocationTable[id];
        if (fallback && name === undefined) {
            return `Unknown Location ${id}`;
        }

        return name;
    }

    /**
     * Returns a network-safe {@link GamePackage} that can be cached and preloaded ahead of time to reduce network load.
     */
    public exportPackage(): GamePackage {
        return {
            checksum: this.checksum,
            item_name_to_id: { ...this.itemTable },
            location_name_to_id: { ...this.locationTable },
        };
    }
}
