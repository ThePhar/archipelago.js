import { JSONSerializableData } from "./JSONSerializableData";

/**
 * Sets the current value of the key to `value`.
 *
 * @category Data Storage Operations
 */
export type ReplaceDataStorageOperation = {
    operation: "replace";

    /** A value for the operation to apply against the current data storage value. */
    value: JSONSerializableData;
};

/**
 * If the key has no value yet, sets the current value of the key to `default` of the {@link SetPacket}'s (`value`
 * is ignored).
 *
 * @category Data Storage Operations
 */
export type DefaultDataStorageOperation = {
    operation: "default";

    /** A value for the operation to apply against the current data storage value. */
    value: JSONSerializableData;
};

/**
 * Adds `value` to the current value of the key, if both the current value and `value` are arrays then `value` will
 * be appended to the current value.
 *
 * @category Data Storage Operations
 */
export type AddDataStorageOperation = {
    operation: "add";

    /** A value for the operation to apply against the current data storage value. */
    value: number | number[];
};

/**
 * Multiplies the current value of the key by `value`.
 *
 * @category Data Storage Operations
 */
export type MultiplyDataStorageOperation = {
    operation: "mul";

    /** A value for the operation to apply against the current data storage value. */
    value: number;
};

/**
 * Multiplies the current value of the key to the power of `value`.
 *
 * @category Data Storage Operations
 */
export type PowerDataStorageOperation = {
    operation: "pow";

    /** A value for the operation to apply against the current data storage value. */
    value: number;
};

/**
 * Sets the current value of the key to the remainder after division by `value`.
 *
 * @category Data Storage Operations
 */
export type ModuloDataStorageOperation = {
    operation: "mod";

    /** A value for the operation to apply against the current data storage value. */
    value: number;
};

/**
 * Sets the current value of the key to `value` if `value` is bigger.
 *
 * @category Data Storage Operations
 */
export type MaxDataStorageOperation = {
    operation: "max";

    /** A value for the operation to apply against the current data storage value. */
    value: number;
};

/**
 * Sets the current value of the key to `value` if `value` is lower.
 *
 * @category Data Storage Operations
 */
export type MinDataStorageOperation = {
    operation: "min";

    /** A value for the operation to apply against the current data storage value. */
    value: number;
};

/**
 * Applies a bitwise **AND** to the current value of the key with `value`.
 *
 * @category Data Storage Operations
 */
export type AndDataStorageOperation = {
    operation: "and";

    /** A value for the operation to apply against the current data storage value. */
    value: number;
};

/**
 * Applies a bitwise **OR** to the current value of the key with value.
 *
 * @category Data Storage Operations
 */
export type OrDataStorageOperation = {
    operation: "or";

    /** A value for the operation to apply against the current data storage value. */
    value: number;
};

/**
 * Applies a bitwise **XOR** to the current value of the key with `value`.
 *
 * @category Data Storage Operations
 */
export type XorDataStorageOperation = {
    operation: "xor";

    /** A value for the operation to apply against the current data storage value. */
    value: number;
};

/**
 * Applies a bitwise left-shift to the current value of the key by `value`.
 *
 * @category Data Storage Operations
 */
export type LeftShiftDataStorageOperation = {
    operation: "left_shift";

    /** A value for the operation to apply against the current data storage value. */
    value: number;
};

/**
 * Applies a bitwise right-shift to the current value of the key by `value`.
 *
 * @category Data Storage Operations
 */
export type RightShiftDataStorageOperation = {
    operation: "right_shift";

    /** A value for the operation to apply against the current data storage value. */
    value: number;
};

/**
 * List only: removes the first instance of `value` found in the list.
 *
 * @category Data Storage Operations
 */
export type RemoveDataStorageOperation = {
    operation: "remove";

    /** A value for the operation to apply against the current data storage value. */
    value: JSONSerializableData;
};

/**
 * List or Dict only: for `lists` it will remove the index of the `value` given. For `dicts` it removes the element with
 * the specified key of `value`.
 *
 * @category Data Storage Operations
 */
export type PopDataStorageOperation = {
    operation: "pop";

    /** A value for the operation to apply against the current data storage value. */
    value: JSONSerializableData;
};

/**
 * Dict only: Updates the dictionary with the specified elements given in `value` creating new keys, or updating old
 * ones if they previously existed.
 *
 * @category Data Storage Operations
 */
export type UpdateDataStorageOperation = {
    operation: "update";

    /** A value for the operation to apply against the current data storage value. */
    value: JSONSerializableData;
};

/**
 * A {@link DataStorageOperation} manipulates or alters the value of a key in the data storage. If the operation
 * transforms the value from one state to another then the current value of the key is used as the starting point
 * otherwise the {@link SetPacket}'s default is used if the key does not exist on the server already.
 *
 * {@link DataStorageOperation}s consist of an object containing both the operation to be applied, provided in the
 * form of a string, and the value to be used for that operation,
 *
 * Example:
 * ```js
 * { operation: "add", value: 12 }
 * ```
 *
 * @category Data Storage Operations
 */
export type DataStorageOperation =
    | ReplaceDataStorageOperation
    | DefaultDataStorageOperation
    | AddDataStorageOperation
    | MultiplyDataStorageOperation
    | PowerDataStorageOperation
    | ModuloDataStorageOperation
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
