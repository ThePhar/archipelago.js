import { APBaseObject, APType } from "@structs";

/**
 * A {@link DataStorageOperation} manipulates or alters the value of a key in the data storage. If the operation
 * transforms the value from one state to another then the current value of the key is used as the starting point
 * otherwise the {@link SetPacket}'s default is used if the key does not exist on the server already.
 * {@link DataStorageOperation}s consist of an object containing both the operation to be applied, provided in the
 * form of a string, as well as the value to be used for that operation,
 *
 * Example:
 * ```js
 * { operation: "add", value: 12 }
 * ```
 *
 * @category Data Storage Operations
 */
export interface BaseDataStorageOperation extends APBaseObject {
    /** The operation to apply to a given data storage key. */
    operation: string;

    /** A value for the operation to apply against the current data storage value. */
    value: APType;
}

/**
 * @category Data Storage Operations
 */
export interface ReplaceDataStorageOperation extends BaseDataStorageOperation {
    /** Sets the current value of the key to `value`. */
    operation: "replace";
}

/**
 * If the key has no value yet, sets the current value of the key to `default` of the {@link SetPacket}'s (`value`
 * is ignored).
 *
 * @category Data Storage Operations
 */
export interface DefaultDataStorageOperation extends BaseDataStorageOperation {
    operation: "default";
}

/**
 * Adds `value` to the current value of the key, if both the current value and `value` are arrays then `value` will
 * be appended to the current value.
 *
 * @category Data Storage Operations
 */
export interface AddDataStorageOperation extends BaseDataStorageOperation {
    operation: "add";
    value: number | number[];
}

/**
 * Multiplies the current value of the key by `value`.
 *
 * @category Data Storage Operations
 */
export interface MultiplyDataStorageOperation extends BaseDataStorageOperation {
    operation: "mul";
    value: number;
}

/**
 * Multiplies the current value of the key to the power of `value`.
 *
 * @category Data Storage Operations
 */
export interface PowerDataStorageOperation extends BaseDataStorageOperation {
    operation: "pow";
    value: number;
}

/**
 * Sets the current value of the key to the remainder after division by `value`.
 *
 * @category Data Storage Operations
 */
export interface ModuloDataStorageOperation extends BaseDataStorageOperation {
    operation: "mod";
    value: number;
}

/**
 * Sets the current value of the key to `value` if `value` is bigger.
 *
 * @category Data Storage Operations
 */
export interface MaxDataStorageOperation extends BaseDataStorageOperation {
    operation: "max";
    value: number;
}

/**
 * Sets the current value of the key to `value` if `value` is lower.
 *
 * @category Data Storage Operations
 */
export interface MinDataStorageOperation extends BaseDataStorageOperation {
    operation: "min";
    value: number;
}

/**
 * Applies a bitwise **AND** to the current value of the key with `value`.
 *
 * @category Data Storage Operations
 */
export interface AndDataStorageOperation extends BaseDataStorageOperation {
    operation: "and";
    value: number;
}

/**
 * Applies a bitwise **OR** to the current value of the key with value.
 *
 * @category Data Storage Operations
 */
export interface OrDataStorageOperation extends BaseDataStorageOperation {
    operation: "or";
    value: number;
}

/**
 * Applies a bitwise **XOR** to the current value of the key with `value`.
 *
 * @category Data Storage Operations
 */
export interface XorDataStorageOperation extends BaseDataStorageOperation {
    operation: "xor";
    value: number;
}

/**
 * Applies a bitwise left-shift to the current value of the key by `value`.
 *
 * @category Data Storage Operations
 */
export interface LeftShiftDataStorageOperation extends BaseDataStorageOperation {
    operation: "left_shift";
    value: number;
}

/**
 * Applies a bitwise right-shift to the current value of the key by `value`.
 *
 * @category Data Storage Operations
 */
export interface RightShiftDataStorageOperation extends BaseDataStorageOperation {
    operation: "right_shift";
    value: number;
}

/**
 * A type union of all supported {@link BaseDataStorageOperation}s on the Archipelago server.
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
    | RightShiftDataStorageOperation;
