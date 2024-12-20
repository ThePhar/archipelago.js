import { DataStorageOperation, JSONSerializable, SetPacket } from "../api";
import { uuid } from "../utils.ts";
import { Client } from "./Client.ts";

/**
 * An intermediate abstract object holding an array of data storage operations to be performed in order by the server.
 * @template T The expected value type from this operation.
 */
export class IntermediateDataOperation<T extends JSONSerializable> {
    readonly #client: Client;
    readonly #operations: DataStorageOperation[] = [];
    readonly #key: string;
    readonly #default: T;

    /**
     * Create an intermediate object for storing data operations.
     * @internal
     * @param client The Archipelago client.
     * @param key The data storage key.
     * @param _default Default value to use, if no value exists.
     */
    public constructor(client: Client, key: string, _default: T) {
        this.#client = client;
        this.#key = key;
        this.#default = _default;
    }

    /**
     * Sets the current value of the key to `value`.
     * @param value A value for the operation to apply against the current data storage value.
     */
    public replace(value: JSONSerializable): IntermediateDataOperation<T> {
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
    public add(value: number | JSONSerializable[]): IntermediateDataOperation<T> {
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
    public remove(value: JSONSerializable): IntermediateDataOperation<T> {
        this.#operations.push({ operation: "remove", value });
        return this;
    }

    /**
     * List or Dict only: for `lists` it will remove the index of the `value` given. For `dicts` it removes the element
     * with the specified key of `value`.
     * @param value A value for the operation to apply against the current data storage value.
     */
    public pop(value: JSONSerializable): IntermediateDataOperation<T> {
        this.#operations.push({ operation: "pop", value });
        return this;
    }

    /**
     * Dict only: Updates the dictionary with the specified elements given in `value` creating new keys, or updating old
     * ones if they previously existed.
     * @param value A value for the operation to apply against the current data storage value.
     */
    public update(value: JSONSerializable): IntermediateDataOperation<T> {
        this.#operations.push({ operation: "update", value });
        return this;
    }

    /**
     * Commit the current operations to data store and return a Promise with the updated key, once fulfilled.
     * @param awaitReply If `true`, a promise will be returned with the new value. Otherwise, immediately resolves.
     */
    public async commit(awaitReply: true): Promise<T>;

    /** Commit the current operations to data store. */
    public async commit(awaitReply?: false): Promise<void>;

    public async commit(awaitReply: boolean = false): Promise<T | void> {
        const _uuid = uuid();
        const request: SetPacket = {
            cmd: "Set",
            default: this.#default,
            key: this.#key,
            operations: this.#operations,
            want_reply: awaitReply,
            uuid: _uuid, // Used to identify this request/response.
        };

        this.#client.socket.send(request);
        if (!awaitReply) {
            return;
        }

        // Wait for our expected response packet to return.
        const [response] = await this.#client.socket.wait("setReply", (packet) => packet.uuid === _uuid);
        return response.value as T;
    }
}
