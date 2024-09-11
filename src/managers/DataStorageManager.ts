import { JSONSerializableData } from "../api";
import { ArchipelagoClient } from "../structs/ArchipelagoClient.ts";
import { IntermediateDataOperation } from "../structs/IntermediateDataOperation.ts";
import { generateUuid } from "../utils.ts";

/**
 * Manages communication between the data storage API and tracks monitored keys.
 */
export class DataStorageManager {
    readonly #client: ArchipelagoClient;
    #storage: Record<string, JSONSerializableData> = {};
    #subscribers: Record<string, DataChangeCallback[]> = {};

    /**
     * Instantiates a new DataStorageManager.
     * @internal
     * @param client The Archipelago client associated with this manager.
     */
    public constructor(client: ArchipelagoClient) {
        this.#client = client;

        // If connection is lost discard all current callbacks.
        this.#client.api.subscribe("onDisconnected", () => {
            this.#storage = {};
            this.#subscribers = {};
        });

        // Track all keys that are being monitored.
        this.#client.api.subscribe("onSetReply", (packet) => {
            this.#storage[packet.key] = packet.value;
            const callbacks = this.#subscribers[packet.key];
            if (callbacks) {
                callbacks.forEach((callback) => callback(packet.key, packet.value, packet.original_value));
            }
        });
    }

    /** Returns a copy of all currently monitored keys. */
    public get storage(): Record<string, JSONSerializableData> {
        return structuredClone(this.#storage);
    }

    /**
     * Fetches provided keys from data storage.
     * @param keys A list of keys to be fetched.
     * @param monitor Adds keys to local cache and request the server to update client when changes are made to speed up
     * subsequent lookups. For one-off adhoc lookups, should be omitted.
     * @returns An object containing all current values for each key requested.
     * @remarks Any keys not currently cached and monitored will be requested over the network instead of from memory.
     */
    public async get(keys: string[], monitor: boolean = false): DataRecordPromise {
        if (monitor) {
            // Request new keys that are not already being monitored to be notified of changes.
            const newKeys = keys.filter((key) => !Object.keys(this.#storage).includes(key));
            if (newKeys.length > 0) {
                this.#client.api.send({ cmd: "SetNotify", keys: newKeys });
            }
        }

        let data: Record<string, JSONSerializableData> = {};
        const request = keys.reduce((keys, key) => {
            const value = structuredClone(this.#storage[key]);
            if (value !== undefined) {
                data[key] = value;
            } else {
                keys.push(key); // Will need to request it from data storage.
            }

            return keys;
        }, [] as string[]);

        // Request additional keys from API.
        if (request.length > 0) {
            const response = await this.#request(...request);
            data = { ...data, ...response };
        }

        return data;
    }

    /**
     * Add a list of keys to be monitored for changes and fire a callback when changes are detected.
     * @param keys A list of keys to fetch and watch for changes.
     * @param callback A callback to fire whenever one of these keys change.
     * @returns An object containing all current values for each key requested.
     * @remarks If connection to the Archipelago server is lost, keys will no longer be tracked for changes and need to
     * be monitored again.
     */
    public async notify(keys: string[], callback: DataChangeCallback): DataRecordPromise {
        keys.forEach((key) => {
            this.#subscribers[key] ??= [];
            this.#subscribers[key].push(callback);
        });

        // Get current values and update local storage.
        const request = await this.get(keys, true);
        this.#storage = { ...this.#storage, ...request };
        return request;
    }

    /**
     * Create a new transaction for setting a data storage key by returning an {@link IntermediateDataOperation}. To
     * perform certain operations, just chain additional methods until finished, then call `prepare()`.
     * @param key The key to manipulate.
     * @param _default The default value to be used if key does not exist.
     * @throws {@link Error} if attempting to modify a read only key.
     * @example
     * // Prepare key "my-key" and set initial value to 100, if key doesn't exist.
     * client.data.prepare("my-key", 100)
     *     .multiply(0.25) // Multiply value by 0.25.
     *     .floor()        // Round down to nearest integer.
     *     .max(0)         // Clamp value above 0.
     *     .commit();      // Commit operations to data storage.
     */
    public prepare(key: string, _default: JSONSerializableData = 0): IntermediateDataOperation {
        if (key.startsWith("_read_")) {
            throw Error("Cannot manipulate read only keys.");
        }

        return new IntermediateDataOperation(this.#client, key, _default);
    }

    async #request(...keys: string[]): DataRecordPromise {
        const code = generateUuid();
        this.#client.api.send({ cmd: "Get", keys, code });
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
}

/** A callback that fires when a monitored key is updated in data storage. */
export type DataChangeCallback = (key: string, value: JSONSerializableData, oldValue?: JSONSerializableData) => void;

/** A promise that resolves to a record of key-value pairs from data storage. */
export type DataRecordPromise = Promise<Record<string, JSONSerializableData>>;
