import { JSONSerializableData } from "./JSONSerializableData.ts";

/**
 * Sets the current value of the key to `value`.
 * @internal
 * @category Data Storage Operation
 */
export type ReplaceDataStorageOperation = {
    readonly operation: "replace"

    /** A value for the operation to apply against the current data storage value. */
    readonly value: JSONSerializableData
};

/**
 * If the key has no value yet, sets the current value of the key to `default` of the {@link SetPacket}'s (`value`
 * is ignored).
 * @internal
 * @category Data Storage Operation
 */
export type DefaultDataStorageOperation = {
    readonly operation: "default"

    /** A value for the operation to apply against the current data storage value. */
    readonly value: JSONSerializableData
};

/**
 * Adds `value` to the current value of the key, if both the current value and `value` are arrays then `value` will
 * be appended to the current value.
 * @internal
 * @category Data Storage Operation
 */
export type AddDataStorageOperation = {
    readonly operation: "add"

    /** A value for the operation to apply against the current data storage value. */
    readonly value: number | number[]
};

/**
 * Multiplies the current value of the key by `value`.
 * @internal
 * @category Data Storage Operation
 */
export type MultiplyDataStorageOperation = {
    readonly operation: "mul"

    /** A value for the operation to apply against the current data storage value. */
    readonly value: number
};

/**
 * Multiplies the current value of the key to the power of `value`.
 * @internal
 * @category Data Storage Operation
 */
export type PowerDataStorageOperation = {
    readonly operation: "pow"

    /** A value for the operation to apply against the current data storage value. */
    readonly value: number
};

/**
 * Sets the current value of the key to the remainder after division by `value`.
 * @internal
 * @category Data Storage Operation
 */
export type ModuloDataStorageOperation = {
    readonly operation: "mod"

    /** A value for the operation to apply against the current data storage value. */
    readonly value: number
};

/**
 * Rounds down the current value to the nearest integer.
 * @internal
 * @category Data Storage Operation
 */
export type FloorDataStorageOperation = {
    readonly operation: "floor"

    /** Ignored for this operation. */
    readonly value: null
};

/**
 * Rounds up the current value to the nearest integer.
 * @internal
 * @category Data Storage Operation
 */
export type CeilingDataStorageOperation = {
    readonly operation: "ceil"

    /** Ignored for this operation. */
    readonly value: null
};

/**
 * Sets the current value of the key to `value` if `value` is bigger.
 * @internal
 * @category Data Storage Operation
 */
export type MaxDataStorageOperation = {
    readonly operation: "max"

    /** A value for the operation to apply against the current data storage value. */
    readonly value: number
};

/**
 * Sets the current value of the key to `value` if `value` is lower.
 * @internal
 * @category Data Storage Operation
 */
export type MinDataStorageOperation = {
    readonly operation: "min"

    /** A value for the operation to apply against the current data storage value. */
    readonly value: number
};

/**
 * Applies a bitwise **AND** to the current value of the key with `value`.
 * @internal
 * @category Data Storage Operation
 */
export type AndDataStorageOperation = {
    readonly operation: "and"

    /** A value for the operation to apply against the current data storage value. */
    readonly value: number
};

/**
 * Applies a bitwise **OR** to the current value of the key with value.
 * @internal
 * @category Data Storage Operation
 */
export type OrDataStorageOperation = {
    readonly operation: "or"

    /** A value for the operation to apply against the current data storage value. */
    readonly value: number
};

/**
 * Applies a bitwise **XOR** to the current value of the key with `value`.
 * @internal
 * @category Data Storage Operation
 */
export type XorDataStorageOperation = {
    readonly operation: "xor"

    /** A value for the operation to apply against the current data storage value. */
    readonly value: number
};

/**
 * Applies a bitwise left-shift to the current value of the key by `value`.
 * @internal
 * @category Data Storage Operation
 */
export type LeftShiftDataStorageOperation = {
    readonly operation: "left_shift"

    /** A value for the operation to apply against the current data storage value. */
    readonly value: number
};

/**
 * Applies a bitwise right-shift to the current value of the key by `value`.
 * @internal
 * @category Data Storage Operation
 */
export type RightShiftDataStorageOperation = {
    readonly operation: "right_shift"

    /** A value for the operation to apply against the current data storage value. */
    readonly value: number
};

/**
 * List only: removes the first instance of `value` found in the list.
 * @internal
 * @category Data Storage Operation
 */
export type RemoveDataStorageOperation = {
    readonly operation: "remove"

    /** A value for the operation to apply against the current data storage value. */
    readonly value: JSONSerializableData
};

/**
 * List or Dict only: for `lists` it will remove the index of the `value` given. For `dicts` it removes the element with
 * the specified key of `value`.
 * @internal
 * @category Data Storage Operation
 */
export type PopDataStorageOperation = {
    readonly operation: "pop"

    /** A value for the operation to apply against the current data storage value. */
    readonly value: JSONSerializableData
};

/**
 * Dict only: Updates the dictionary with the specified elements given in `value` creating new keys, or updating old
 * ones if they previously existed.
 * @internal
 * @category Data Storage Operation
 */
export type UpdateDataStorageOperation = {
    readonly operation: "update"

    /** A value for the operation to apply against the current data storage value. */
    readonly value: JSONSerializableData
};

/**
 * A {@link DataStorageOperation} manipulates or alters the value of a key in the data storage. If the operation
 * transforms the value from one state to another then the current value of the key is used as the starting point
 * otherwise the {@link SetPacket}'s default is used if the key does not exist on the server already.
 *
 * {@link DataStorageOperation}s consist of an object containing both the operation to be applied, provided in the
 * form of a string, and the value to be used for that operation,
 * @internal
 * @example
 * ```js
 * { operation: "add", value: 12 }
 * ```
 * @category Data Storage Operation
 */
export type DataStorageOperation =
    | ReplaceDataStorageOperation
    | DefaultDataStorageOperation
    | AddDataStorageOperation
    | MultiplyDataStorageOperation
    | PowerDataStorageOperation
    | ModuloDataStorageOperation
    | FloorDataStorageOperation
    | CeilingDataStorageOperation
    | MaxDataStorageOperation
    | MinDataStorageOperation
    | AndDataStorageOperation
    | OrDataStorageOperation
    | XorDataStorageOperation
    | LeftShiftDataStorageOperation
    | RightShiftDataStorageOperation
    | RemoveDataStorageOperation
    | PopDataStorageOperation
    | UpdateDataStorageOperation;
