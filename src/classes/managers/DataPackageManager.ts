import { DataPackage, GamePackage, GetDataPackagePacket } from "../../api";
import { Client } from "../Client.ts";
import { PackageMetadata } from "../PackageMetadata.ts";

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
        this.#client.socket.on("roomInfo", (packet) => {
            this.#packages.clear();
            this.#checksums.clear();
            this.#games.clear();

            this.#packages.set("Archipelago", this.#preloadArchipelago());
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
                .wait("dataPackage");

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
            this.#packages.set(game, new PackageMetadata(game, dataPackage.games[game]));
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
     * Lookup an item name by its integer id.
     * @param game The name of the game this item is associated with.
     * @param id The id of the item to name lookup.
     * @param fallback If `true`, returns `"Unknown Item {id}"` instead of `undefined`, if id does not exist in package.
     * Defaults to `true`, if omitted.
     */
    public lookupItemName(game: string, id: number, fallback?: true): string;

    /**
     * Lookup an item name by its integer id.
     * @param game The name of the game this item is associated with.
     * @param id The id of the item to name lookup.
     * @param fallback If `true`, returns `"Unknown Item {id}"` instead of `undefined`, if id does not exist in package.
     * Defaults to `true`, if omitted.
     */
    public lookupItemName(game: string, id: number, fallback: false): string | undefined;

    public lookupItemName(game: string, id: number, fallback: boolean = true): string | undefined {
        const fallbackName = `Unknown Item ${id}`;
        const gamePackage = this.findPackage(game);
        if (!gamePackage) {
            return fallback ? fallbackName : undefined;
        }

        const name = gamePackage.reverseItemTable[id];
        if (fallback && name === undefined) {
            return fallbackName;
        }

        return name;
    }

    /**
     * Lookup a location name by its integer id.
     * @param game The name of the game this location is associated with.
     * @param id The id of the location to name lookup.
     * @param fallback If `true`, returns `"Unknown Location {id}"` instead of `undefined`, if id does not exist in
     * package. Defaults to `true`, if omitted.
     */
    public lookupLocationName(game: string, id: number, fallback?: true): string;

    /**
     * Lookup a location name by its integer id.
     * @param game The name of the game this location is associated with.
     * @param id The id of the location to name lookup.
     * @param fallback If `true`, returns `"Unknown Location {id}"` instead of `undefined`, if id does not exist in
     * package. Defaults to `true`, if omitted.
     */
    public lookupLocationName(game: string, id: number, fallback: false): string | undefined;

    public lookupLocationName(game: string, id: number, fallback: boolean = true): string | undefined {
        const fallbackName = `Unknown Location ${id}`;
        const gamePackage = this.findPackage(game);
        if (!gamePackage) {
            return fallback ? fallbackName : undefined;
        }

        const name = gamePackage.reverseLocationTable[id];
        if (fallback && name === undefined) {
            return fallbackName;
        }

        return name;
    }

    /**
     * Returns preloaded data (i.e., Archipelago data package, since it's always available).
     * @private
     * @remarks If updates to the AP game package happen, this should be updated.
     */
    #preloadArchipelago(): PackageMetadata {
        // As of AP 0.5.0
        return new PackageMetadata("Archipelago", {
            checksum: "ac9141e9ad0318df2fa27da5f20c50a842afeecb",
            item_name_to_id: { Nothing: -1 },
            location_name_to_id: { "Cheat Console": -1, "Server": -2 },
        });
    }
}
