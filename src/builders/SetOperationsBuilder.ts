import { CLIENT_PACKET_TYPE } from "../consts/CommandPacketType";
import { SetPacket } from "../packets/SetPacket";
import { DataStorageOperation } from "../types/DataStorageOperations";
import { JSONSerializableData } from "../types/JSONSerializableData";

/**
 * A helper class of data operations to perform server-side on a given key.
 */
export class SetOperationsBuilder {
    readonly #operations: DataStorageOperation[] = [];
    readonly #key: string;
    readonly #default: Exclude<JSONSerializableData, undefined>;
    readonly #wantReply: boolean;

    public constructor(key: string, defaultValue: Exclude<JSONSerializableData, undefined>, wantReply = false) {
        this.#key = key;
        this.#default = defaultValue;
        this.#wantReply = wantReply;
    }

    public replace(value: JSONSerializableData): SetOperationsBuilder {
        this.#operations.push({
            operation: "replace",
            value,
        });

        return this;
    }

    public default(value: JSONSerializableData): SetOperationsBuilder {
        this.#operations.push({
            operation: "default",
            value,
        });

        return this;
    }

    public add(value: number | number[]): SetOperationsBuilder {
        this.#operations.push({
            operation: "add",
            value,
        });

        return this;
    }

    public multiply(value: number): SetOperationsBuilder {
        this.#operations.push({
            operation: "mul",
            value,
        });

        return this;
    }

    public power(value: number): SetOperationsBuilder {
        this.#operations.push({
            operation: "pow",
            value,
        });

        return this;
    }

    public modulo(value: number): SetOperationsBuilder {
        this.#operations.push({
            operation: "mod",
            value,
        });

        return this;
    }

    public max(value: number): SetOperationsBuilder {
        this.#operations.push({
            operation: "max",
            value,
        });

        return this;
    }

    public min(value: number): SetOperationsBuilder {
        this.#operations.push({
            operation: "min",
            value,
        });

        return this;
    }

    public and(value: number): SetOperationsBuilder {
        this.#operations.push({
            operation: "and",
            value,
        });

        return this;
    }

    public or(value: number): SetOperationsBuilder {
        this.#operations.push({
            operation: "or",
            value,
        });

        return this;
    }

    public xor(value: number): SetOperationsBuilder {
        this.#operations.push({
            operation: "xor",
            value,
        });

        return this;
    }

    public shiftLeft(value: number): SetOperationsBuilder {
        this.#operations.push({
            operation: "left_shift",
            value,
        });

        return this;
    }

    public shiftRight(value: number): SetOperationsBuilder {
        this.#operations.push({
            operation: "right_shift",
            value,
        });

        return this;
    }

    public remove(value: JSONSerializableData): SetOperationsBuilder {
        this.#operations.push({
            operation: "remove",
            value,
        });

        return this;
    }

    public pop(value: JSONSerializableData): SetOperationsBuilder {
        this.#operations.push({
            operation: "pop",
            value,
        });

        return this;
    }

    public update(value: JSONSerializableData): SetOperationsBuilder {
        this.#operations.push({
            operation: "update",
            value,
        });

        return this;
    }

    public build(): SetPacket {
        return {
            cmd: CLIENT_PACKET_TYPE.SET,
            key: this.#key,
            default: this.#default,
            want_reply: this.#wantReply,
            operations: this.#operations,
        };
    }
}
