import { AbstractSlotData, ClientPacketType, JSONSerializableData } from "./api";
import { DataStorageOperation } from "./api/types/DataStorageOperations.ts";
import { ArchipelagoClient } from "./ArchipelagoClient.ts";
import { SetPacket } from "./api/packets";
import { generateUUIDv4 } from "./utils/UUIDGenerator.ts";

/**
 * An intermediate abstract object holding an array of data storage operations to be performed in order by the server.
 * @template T The type of value to be manipulated.
 */
export class IntermediateDataOperation<T extends JSONSerializableData> {
    readonly #client: ArchipelagoClient<AbstractSlotData>;
    readonly #operations: DataStorageOperation[] = [];
    readonly #key: string;
    readonly #default: Exclude<T, undefined>;
    readonly #code: string;

    /**
     * Create an intermediate object for storing data operations.
     * @internal
     * @param client The Archipelago client.
     * @param key The data storage key.
     * @param _default Default value to use, if no value exists.
     */
    public constructor(client: ArchipelagoClient<AbstractSlotData>, key: string, _default: Exclude<T, undefined>) {
        this.#client = client;
        this.#key = key;
        this.#default = _default;
        this.#code = generateUUIDv4();
    }

    /**
     * Sets the current value of the key to `value`.
     * @param value A value for the operation to apply against the current data storage value.
     */
    public replace(value: JSONSerializableData): IntermediateDataOperation<T> {
        this.#operations.push({ operation: "replace", value });
        return this;
    }

    /**
     * If the key has no value yet, sets the current value of the key to `default`.
     */
    public default(): IntermediateDataOperation<T> {
        this.#operations.push({ operation: "default", value: null });
        return this;
    }

    /**
     * Adds `value` to the current value of the key, if both the current value and `value` are arrays then `value` will
     * be appended to the current value.
     * @param value A value for the operation to apply against the current data storage value.
     */
    public add(value: number | JSONSerializableData[]): IntermediateDataOperation<T> {
        this.#operations.push({ operation: "add", value });
        return this;
    }

    /**
     * Multiplies the current value of the key by `value`.
     * @param value A value for the operation to apply against the current data storage value.
     */
    public multiply(value: number): IntermediateDataOperation<T> {
        this.#operations.push({ operation: "mul", value });
        return this;
    }

    /**
     * Multiplies the current value of the key to the power of `value`.
     * @param value A value for the operation to apply against the current data storage value.
     */
    public power(value: number): IntermediateDataOperation<T> {
        this.#operations.push({ operation: "pow", value });
        return this;
    }

    /**
     * Sets the current value of the key to the remainder after division by `value`.
     * @param value A value for the operation to apply against the current data storage value.
     */
    public remainder(value: number): IntermediateDataOperation<T> {
        this.#operations.push({ operation: "mod", value });
        return this;
    }

    /**
     * Rounds down the current value to the nearest integer.
     */
    public floor(): IntermediateDataOperation<T> {
        this.#operations.push({ operation: "floor", value: null });
        return this;
    }

    /**
     * Rounds up the current value to the nearest integer.
     */
    public ceiling(): IntermediateDataOperation<T> {
        this.#operations.push({ operation: "ceil", value: null });
        return this;
    }

    /**
     * Sets the current value of the key to `value` if `value` is bigger.
     * @param value A value for the operation to apply against the current data storage value.
     */
    public max(value: number): IntermediateDataOperation<T> {
        this.#operations.push({ operation: "max", value });
        return this;
    }

    /**
     * Sets the current value of the key to `value` if `value` is bigger.
     * @param value A value for the operation to apply against the current data storage value.
     */
    public min(value: number): IntermediateDataOperation<T> {
        this.#operations.push({ operation: "min", value });
        return this;
    }

    /**
     * Applies a bitwise **AND** to the current value of the key with `value`.
     * @param value A value for the operation to apply against the current data storage value.
     */
    public and(value: number): IntermediateDataOperation<T> {
        this.#operations.push({ operation: "and", value });
        return this;
    }

    /**
     * Applies a bitwise **OR** to the current value of the key with value.
     * @param value A value for the operation to apply against the current data storage value.
     */
    public or(value: number): IntermediateDataOperation<T> {
        this.#operations.push({ operation: "or", value });
        return this;
    }

    /**
     * Applies a bitwise **XOR** to the current value of the key with value.
     * @param value A value for the operation to apply against the current data storage value.
     */
    public xor(value: number): IntermediateDataOperation<T> {
        this.#operations.push({ operation: "xor", value });
        return this;
    }

    /**
     * Applies a bitwise left-shift to the current value of the key by `value`.
     * @param value A value for the operation to apply against the current data storage value.
     */
    public leftShift(value: number): IntermediateDataOperation<T> {
        this.#operations.push({ operation: "left_shift", value });
        return this;
    }

    /**
     * Applies a bitwise right-shift to the current value of the key by `value`.
     * @param value A value for the operation to apply against the current data storage value.
     */
    public rightShift(value: number): IntermediateDataOperation<T> {
        this.#operations.push({ operation: "right_shift", value });
        return this;
    }

    /**
     * List only: removes the first instance of `value` found in the list.
     * @param value A value for the operation to apply against the current data storage value.
     */
    public remove(value: JSONSerializableData): IntermediateDataOperation<T> {
        this.#operations.push({ operation: "remove", value });
        return this;
    }

    /**
     * List or Dict only: for `lists` it will remove the index of the `value` given. For `dicts` it removes the element
     * with the specified key of `value`.
     * @param value A value for the operation to apply against the current data storage value.
     */
    public pop(value: JSONSerializableData): IntermediateDataOperation<T> {
        this.#operations.push({ operation: "pop", value });
        return this;
    }

    /**
     * Dict only: Updates the dictionary with the specified elements given in `value` creating new keys, or updating old
     * ones if they previously existed.
     * @param value A value for the operation to apply against the current data storage value.
     */
    public update(value: JSONSerializableData): IntermediateDataOperation<T> {
        this.#operations.push({ operation: "update", value });
        return this;
    }

    public commit(awaitReply: true): Promise<T>;
    public commit(awaitReply: false): void;

    /**
     * Commit the current operations to data store.
     * @param awaitReply If `true`, a promise will be returned with the new value. Otherwise, immediately returns.
     */
    public commit(awaitReply: boolean = false): Promise<T> | void {
        const packet: SetPacket = {
            cmd: ClientPacketType.Set,
            default: this.#default,
            key: this.#key,
            operations: this.#operations,
            want_reply: awaitReply,
            code: this.#code, // Used to determine this exact packet.
        };

        this.#client.socket.send(packet);
        if (!awaitReply) {
            return;
        }

        return new Promise((resolve) => {
            const unsub = this.#client.socket.subscribe("onSetReply", (packet) => {
                if (packet["code"] !== this.#code) {
                    return;
                }

                unsub();
                resolve(packet.value as T);
            });
        });
    }
}
