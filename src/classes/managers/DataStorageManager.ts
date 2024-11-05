import { JSONRecord, JSONSerializable } from "../../api";
import { libraryVersion } from "../../constants.ts";
import { uuid } from "../../utils.ts";
import { Client } from "../Client.ts";
import { IntermediateDataOperation } from "../IntermediateDataOperation.ts";

/** A callback that fires when a monitored key is updated in data storage. */
export type DataChangeCallback = (key: string, value: JSONSerializable, oldValue?: JSONSerializable) => void;

/**
 * Manages communication between the data storage API and notifies subscribers of changes to storage updates.
 */
export class DataStorageManager {
    readonly #client: Client;
    #storage: JSONRecord = {};
    #subscribers: Record<string, DataChangeCallback[]> = {};

    /**
     * Instantiates a new DataStorageManager.
     * @internal
     * @param client The Archipelago client associated with this manager.
     */
    public constructor(client: Client) {
        this.#client = client;
        this.#client.socket
            .on("disconnected", () => {
                // If connection is lost, discard storage and subscribers as the server no longer will notify, and we
                // cannot be sure the storage is accurate anymore.
                this.#storage = {};
                this.#subscribers = {};
            })
            // Keep track of monitored keys.
            .on("setReply", (packet) => {
                this.#storage[packet.key] = packet.value;
                const callbacks = this.#subscribers[packet.key];
                if (callbacks) {
                    callbacks.forEach((callback) => callback(packet.key, packet.value, packet.original_value));
                }
            })
            .on("connected", () => {
                if (this.#client.options.debugLogVersions) {
                    // For debug purposes log our data to data storage.
                    // Inspiration for this comes from the MultiClient.Net project.
                    const key = `${this.#client.game}:${libraryVersion}:${navigator?.userAgent}`;
                    void this.prepare("archipelago.js__runtimes", {})
                        .default()
                        .update({ [key]: true })
                        .commit(false);
                }
            });
    }

    /** Returns a copy of all currently monitored keys. */
    public get store(): JSONRecord {
        return structuredClone(this.#storage);
    }

    /**
     * Fetches a list of key-value pairs from data storage.
     * @template T The expected key-value types to be returned.
     * @param keys A list of keys to fetch values for.
     * @param monitor Adds keys to local cache and request the server to update client when changes are made to speed up
     * subsequent lookups.
     * @returns An object containing all current values for each key requested.
     * @remarks Any keys not currently cached and monitored will be requested over the network instead of from memory.
     */
    public async fetch<T extends JSONRecord>(keys: Array<keyof T>, monitor?: boolean): Promise<T>;

    /**
     * Fetches a single key-value pair from data storage.
     * @template T The expected value type to be returned.
     * @param key The key to fetch a value for.
     * @param monitor Adds key to local cache and request the server to update client when changes are made to speed up
     * subsequent lookups.
     * @returns The current value for this key.
     * @remarks Any keys not currently cached and monitored will be requested over the network instead of from memory.
     */
    public async fetch<T extends JSONSerializable>(key: string, monitor?: boolean): Promise<T>;

    public async fetch<T>(input: string | Array<keyof T>, monitor: boolean = false): Promise<T> {
        let keys: string[] = typeof input === "string" ? [input] : input as string[];
        if (monitor) {
            const monitorKeys = keys.filter((key) => this.#storage[key] === undefined);
            if (monitorKeys.length > 0) {
                this.#client.socket.send({ cmd: "SetNotify", keys: monitorKeys });
            }
        }

        // Pull keys that exist in monitored local storage.
        let data: JSONRecord = {};
        keys = keys.filter((key) => {
            const value = structuredClone(this.#storage[key]);
            const exists = value !== undefined;
            if (exists) {
                data[key] = value;
            }

            return !exists;
        });

        // Request remaining keys from API.
        if (keys.length > 0) {
            const response = await this.#get(keys);
            data = { ...data, ...response };
        }

        // Add monitored keys to local storage.
        if (monitor) {
            this.#storage = { ...this.#storage, ...data };
        }

        return (typeof input === "string" ? data[input] : data) as T;
    }

    /**
     * Add a list of keys to be monitored for changes and fire a callback when changes are detected.
     * @param keys A list of keys to fetch and watch for changes.
     * @param callback A callback to fire whenever one of these keys change.
     * @returns An object containing all current values for each key requested.
     * @remarks If connection to the Archipelago server is lost, keys will no longer be tracked for changes and need to
     * be monitored again.
     * @example
     * const keys = ["key1", "key2"];
     * const data = await client.storage.notify(keys, (key, value, oldValue) => {
     *     console.log(`Key '${key}' has been updated from ${oldValue} to ${value}!`);
     * });
     *
     * client.storage
     *     .prepare("key2", 0)
     *     .add(5)
     *     .commit();
     * // Key 'key2' has been updated from 0 to 5!
     */
    public async notify<T extends JSONRecord>(keys: Array<keyof T>, callback: DataChangeCallback): Promise<T> {
        keys.forEach((key) => {
            this.#subscribers[key as string] ??= [];
            this.#subscribers[key as string].push(callback);
        });

        // Get current values and update local storage.
        return this.fetch(keys, true);
    }

    /**
     * Create a new transaction for setting a data storage key by returning an {@link IntermediateDataOperation}. To
     * perform certain operations, just chain additional methods until finished, then call `prepare()`.
     * @param key The key to manipulate.
     * @param _default The default value to be used if key does not exist.
     * @throws TypeError if attempting to modify a read only key.
     * @example
     * // Prepare key "my-key" and set initial value to 100, if key doesn't exist.
     * client.storage
     *     .prepare("my-key", 100)
     *     .multiply(0.25) // Multiply value by 0.25.
     *     .floor()        // Round down to nearest integer.
     *     .max(0)         // Clamp value above 0.
     *     .commit();      // Commit operations to data storage.
     */
    public prepare<T extends JSONSerializable>(key: string, _default: T): IntermediateDataOperation<T> {
        if (key.startsWith("_read_")) {
            throw TypeError("Cannot manipulate read only keys.");
        }

        return new IntermediateDataOperation(this.#client, key, _default);
    }

    /**
     * Returns item name groups for this package from data storage API.
     * @param game The game name to look up item name groups for.
     */
    public async fetchItemNameGroups(game: string): Promise<Record<string, string[]>> {
        // Get key and locally cache for faster subsequent lookups.
        return await this.fetch([`_read_item_name_groups_${game}`], true);
    }

    /**
     * Returns location name groups for this package from the data storage API.
     * @param game The game name to look up location name groups for.
     */
    public async fetchLocationNameGroups(game: string): Promise<Record<string, string[]>> {
        // Get key and locally cache for faster subsequent lookups.
        return await this.fetch([`_read_location_name_groups_${game}`], true);
    }

    async #get(keys: string[]): Promise<JSONRecord> {
        const _uuid = uuid();
        const [response] = await this.#client.socket
            .send({ cmd: "Get", keys, uuid: _uuid })
            .wait("retrieved", (packet) => packet.uuid === _uuid);

        return response.keys;
    }
}
