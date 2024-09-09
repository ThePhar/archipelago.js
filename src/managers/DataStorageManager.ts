import { AbstractSlotData, ClientPacketType, JSONSerializableData } from "../api";
import { GetPacket } from "../api/packets";
import { ArchipelagoClient } from "../ArchipelagoClient.ts";
import { IntermediateDataOperation } from "../IntermediateDataOperation.ts";
import { generateUUIDv4 } from "../utils/UUIDGenerator.ts";

/**
 * Manages communication with the data storage.
 */
export class DataStorageManager {
    readonly #client: ArchipelagoClient<AbstractSlotData>;

    /**
     * Creates a new DataStorageManager.
     * @internal
     * @param client The Archipelago client.
     */
    public constructor(client: ArchipelagoClient<AbstractSlotData>) {
        this.#client = client;
    }

    /**
     * Create a new transaction for setting a data storage key by returning an {@link IntermediateDataOperation}. To
     * perform certain operations, just chain additional methods until finished, then `commit()`.
     * @param key The key to manipulate.
     * @param _default A default value to be used if a `default()` operation is performed.
     * @example
     * // Send data without retrieving new value.
     * client.data.set("my-key")
     *     .default()
     *     .add(5)
     *     .multiply(0.25)
     *     .floor()
     *     .max(0)
     *     .commit();
     *
     * // Send data and retrieve new value.
     * const value = await client.data.set("my-key")
     *     .default()
     *     .add(5)
     *     .multiply(0.25)
     *     .floor()
     *     .max(0)
     *     .commit(true); // Returns a promise with new value once fulfilled.
     */
    public set(key: string, _default: Exclude<JSONSerializableData, undefined>): IntermediateDataOperation<JSONSerializableData> {
        if (key.startsWith("_read_")) {
            throw Error("Cannot manipulate read only keys.");
        }

        return new IntermediateDataOperation<JSONSerializableData>(this.#client, key, _default);
    }

    /**
     * Request a collection of key-value pairs from the data storage.
     * @param keys A list of keys to be requested.
     */
    public get(...keys: string[]): Promise<Record<string, JSONSerializableData>> {
        const code = generateUUIDv4();
        const packet: GetPacket = {
            cmd: ClientPacketType.Get,
            keys,
            code, // Used to determine this exact packet.
        };

        this.#client.socket.send(packet);
        return new Promise((resolve) => {
            const unsub = this.#client.socket.subscribe("onRetrieved", (packet) => {
                if (packet["code"] !== code) {
                    return;
                }

                unsub();
                resolve(packet.keys);
            });
        });
    }

    /**
     * Register to fire a callback whenever any supplied key is modified in the current session.
     * @param keys A list of keys to fire the callback.
     * @param callback A callback function that includes the key that was modified, the new value, and the old value.
     * @remarks No unsubscribe function is provided as it is not possible to stop requesting notifications without
     * disconnecting the client first.
     */
    public notify(
        keys: string[],
        callback: (key: string, value: JSONSerializableData, originalValue: JSONSerializableData) => void,
    ): void {
        // No need to return unsub function, since the server will still send packets anyway. Upto lib-user to deal with
        // it.
        this.#client.socket.send({ cmd: ClientPacketType.SetNotify, keys });
        this.#client.socket.subscribe("onSetReply", (packet) => {
            if (!keys.includes(packet.key)) {
                return;
            }

            callback(packet.key, packet.value, packet.original_value);
        });
    }
}
