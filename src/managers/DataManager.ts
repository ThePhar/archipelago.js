import { DataPackage, JSONSerializableData } from "../api";
import { GetPacket } from "../api/packets";
import { ArchipelagoClient } from "../structs/ArchipelagoClient.ts";
import { IntermediateDataOperation } from "../structs/IntermediateDataOperation.ts";
import { APEventUnsubscribe, generateUuid } from "../utils.ts";

/**
 * Manages communication between the data storage API and data package for item and location name lookups.
 */
export class DataManager {
    readonly #client: ArchipelagoClient;
    #storage: Record<string, JSONSerializableData | undefined> = {};
    #package: {
        [game: string]: {
            itemNameLookup: Record<number, string>
            locationNameLookup: Record<number, string>
            itemIdLookup: Record<string, number>
            locationIdLookup: Record<string, number>
            checksum: string
        }
    } = {};

    /**
     * Instantiates a new DataStorageManager.
     * @internal
     * @param client The Archipelago client associated with this manager.
     */
    public constructor(client: ArchipelagoClient) {
        this.#client = client;
    }

    /**
     * Prefills internal data package with existing data package data, such as data cached, to reduce network bandwidth.
     * @param dataPackage
     */
    public preloadDataPackage(dataPackage: DataPackage): void {
        for (const game in dataPackage.games) {
            this.#package[game] = {
                itemIdLookup: dataPackage.games[game].item_name_to_id,
                locationIdLookup: dataPackage.games[game].location_name_to_id,
                checksum: dataPackage.games[game].checksum,
                itemNameLookup: Object.fromEntries(Object.entries(dataPackage.games[game].item_name_to_id).map((a) => a.reverse())),
                locationNameLookup: Object.fromEntries(Object.entries(dataPackage.games[game].location_name_to_id).map((a) => a.reverse())),
            };
        }
    }

    /**
     * Requests an updated data package from the server.
     * @param games A list of games to fetch game packages for. If omitted, fetches all game packages in the session.
     * @param force If `false`, preloaded game packages will not be fetched to save bandwidth, unless checksum doesn't
     * match the server. On `true`, it always downloads (not recommended).
     */
    public async loadDataPackage(games?: string[], force?: boolean): Promise<void> {
        // TODO: Needs room manager ready.
    }

    /**
     * Returns a copy of the data package. Helpful for caching to preload later.
     */
    public getDataPackage(): DataPackage {
        const dataPackage: DataPackage = { games: {} };
        for (const game in this.#package) {
            dataPackage.games[game] = {
                item_name_to_id: this.#package[game].itemIdLookup,
                location_name_to_id: this.#package[game].locationIdLookup,
                checksum: this.#package[game].checksum,
            };
        }

        return dataPackage;
    }

    /**
     * Fires a callback when a specified key is modified and add key to list of watched keys if not already being
     * watched.
     * @param key The key to monitor for changes.
     * @param callback The callback to call when the key is modified.
     * @returns A function to stop listening for changes, when no longer needed. Key will remain in watched list for
     * remainder of session and can be accessed via {@link DataManager.get}.
     * @remarks Keys prefixed with `_read_` do not include `oldValue`.
     */
    public notify(
        key: string,
        callback: (key: string, value: JSONSerializableData, oldValue: JSONSerializableData | undefined) => void,
    ): APEventUnsubscribe {
        // If we aren't already tracking this key, begin tracking it. We don't care about the promise in this case.
        if (!Object.keys(this.#storage).includes(key)) {
            void this.watch(key);
        }

        return this.#client.api.subscribe("onSetReply", (packet) => {
            if (packet.key === key) {
                callback(packet.key, packet.value, packet.original_value);
            }
        });
    };

    /**
     * Returns a watched key's current value. If key is not watched (or key doesn't exist), this will return
     * `undefined` instead.
     * @param key The key to pull the value from.
     * @remarks Only keys that are being explicitly watched by calling {@link DataManager.watch} or
     * {@link DataManager.notify} are returned by this method.
     */
    public get(key: string): Readonly<JSONSerializableData> | undefined {
        const value = this.#storage[key];
        if (typeof value === "object" && value !== null) {
            return Object.freeze(value);
        }

        return value;
    }

    /**
     * Create a new transaction for setting a data storage key by returning an {@link IntermediateDataOperation}. To
     * perform certain operations, just chain additional methods until finished, then `set()`.
     * @param key The key to manipulate.
     * @param _default A default value to be used if a `default()` operation is performed.
     * @throws {@link Error} if attempting to modify a read only key.
     * @example
     * client.data
     *     .prepare("my-key", 100) // Prepare key "my-key" and set value to 100, if key doesn't already exist.
     *     .add(5)                 // Add 5 to value.
     *     .multiply(0.25)         // Multiply value by 0.25 (or divide by 4, in other words).
     *     .floor()                // Round down to nearest integer.
     *     .max(0)                 // Ensure value does not go below 0, otherwise clamp to 0.
     *     .set();                 // Commit the operations to data storage.
     */
    public prepare<T extends JSONSerializableData>(key: string, _default: T): IntermediateDataOperation<T> {
        if (key.startsWith("_read_")) {
            throw Error("Cannot manipulate read only keys.");
        }

        return new IntermediateDataOperation<T>(this.#client, key, _default);
    }

    /**
     * Request an adhoc collection of key-value pairs from data storage.
     * @param keys A list of keys to be requested.
     * @returns A record containing all the requested keys and their values.
     */
    public async request(...keys: string[]): Promise<Record<string, JSONSerializableData>> {
        const code = generateUuid();
        const packet: GetPacket = { cmd: "Get", keys, code };

        this.#client.api.send(packet);
        return new Promise((resolve) => {
            const unsubscribe = this.#client.api.subscribe("onRetrieved", (packet) => {
                // Ignore retrieves that aren't for this specific callback.
                if (packet["code"] !== code) {
                    return;
                }

                unsubscribe();
                resolve(packet.keys);
            });
        });
    }

    /**
     * Add a list of keys to be monitored for changes that can be later retrieved via {@link DataManager.get}.
     * @param keys A list of keys to monitor for changes.
     * @returns A promise with a record containing all requested keys' and their current values.
     */
    public async watch(...keys: string[]): Promise<Readonly<Record<string, JSONSerializableData>>> {
        // Remove any keys that are already being monitored.
        const monitoredKeys = Object.keys(this.#storage);
        keys = keys.filter((key) => !monitoredKeys.includes(key));

        // Tell the server we want to monitor these keys for changes and get their current value.
        const code = generateUuid();
        this.#client.api.send({ cmd: "SetNotify", keys });
        this.#client.api.send({ cmd: "Get", keys, code });

        return new Promise((resolve) => {
            const unsubscribe = this.#client.api.subscribe("onRetrieved", (packet) => {
                if (packet.code !== code) {
                    return;
                }

                unsubscribe();
                this.#storage = { ...this.#storage, ...packet.keys };
                resolve(packet.keys);
            });
        });
    }
}
