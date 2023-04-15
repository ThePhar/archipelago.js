import { DataStorageOperation } from "./DataOperations";
import { APType } from "./index";
import { SetPacket } from "../packets";
import { CommandPacketType } from "../enums";

/**
 * A helper class of data operations to perform server-side on a given key.
 */
export class SetOperationsBuilder {
    private readonly _operations: DataStorageOperation[] = [];
    private readonly _key: string;
    private readonly _default: APType;
    private readonly _wantReply: boolean;

    public constructor(key: string, defaultValue?: APType, wantReply = false) {
        this._key = key;
        this._default = defaultValue;
        this._wantReply = wantReply;
    }

    public replace(value: APType): SetOperationsBuilder {
        this._operations.push({
            operation: "replace",
            value,
        });

        return this;
    }

    public default(value: APType): SetOperationsBuilder {
        this._operations.push({
            operation: "default",
            value,
        });

        return this;
    }

    public add(value: number | number[]): SetOperationsBuilder {
        this._operations.push({
            operation: "add",
            value,
        });

        return this;
    }

    public multiply(value: number): SetOperationsBuilder {
        this._operations.push({
            operation: "mul",
            value,
        });

        return this;
    }

    public power(value: number): SetOperationsBuilder {
        this._operations.push({
            operation: "pow",
            value,
        });

        return this;
    }

    public modulo(value: number): SetOperationsBuilder {
        this._operations.push({
            operation: "mod",
            value,
        });

        return this;
    }

    public max(value: number): SetOperationsBuilder {
        this._operations.push({
            operation: "max",
            value,
        });

        return this;
    }

    public min(value: number): SetOperationsBuilder {
        this._operations.push({
            operation: "min",
            value,
        });

        return this;
    }

    public and(value: number): SetOperationsBuilder {
        this._operations.push({
            operation: "and",
            value,
        });

        return this;
    }

    public or(value: number): SetOperationsBuilder {
        this._operations.push({
            operation: "or",
            value,
        });

        return this;
    }

    public xor(value: number): SetOperationsBuilder {
        this._operations.push({
            operation: "xor",
            value,
        });

        return this;
    }

    public shiftLeft(value: number): SetOperationsBuilder {
        this._operations.push({
            operation: "left_shift",
            value,
        });

        return this;
    }

    public shiftRight(value: number): SetOperationsBuilder {
        this._operations.push({
            operation: "right_shift",
            value,
        });

        return this;
    }

    public remove(value: APType): SetOperationsBuilder {
        this._operations.push({
            operation: "remove",
            value,
        });

        return this;
    }

    public pop(value: APType): SetOperationsBuilder {
        this._operations.push({
            operation: "pop",
            value,
        });

        return this;
    }

    public update(value: APType): SetOperationsBuilder {
        this._operations.push({
            operation: "update",
            value,
        });

        return this;
    }

    public build(): SetPacket {
        return {
            cmd: CommandPacketType.SET,
            key: this._key,
            default: this._default,
            want_reply: this._wantReply,
            operations: this._operations,
        };
    }
}
