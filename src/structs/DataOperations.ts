import { APBaseObject, APType } from "@structs";

/**
 * @category Data Operations
 */
export interface DataOperation extends APBaseObject {
    readonly operation: string;
    readonly value: APType;
}

/**
 * @category Data Operations
 */
export interface ReplaceOperation extends DataOperation {
    readonly operation: "replace";
}

/**
 * @category Data Operations
 */
export interface DefaultOperation extends DataOperation {
    readonly operation: "default";
}

/**
 * @category Data Operations
 */
export interface AddOperation extends DataOperation {
    readonly operation: "add";
    readonly value: number;
}

/**
 * @category Data Operations
 */
export interface MultiplyOperation extends DataOperation {
    readonly operation: "mul";
    readonly value: number;
}

/**
 * @category Data Operations
 */
export interface PowerOperation extends DataOperation {
    readonly operation: "pow";
    readonly value: number;
}

/**
 * @category Data Operations
 */
export interface ModuloOperation extends DataOperation {
    readonly operation: "mod";
    readonly value: number;
}

/**
 * @category Data Operations
 */
export interface MaxOperation extends DataOperation {
    readonly operation: "max";
    readonly value: number;
}

/**
 * @category Data Operations
 */
export interface MinOperation extends DataOperation {
    readonly operation: "min";
    readonly value: number;
}

/**
 * @category Data Operations
 */
export interface AndOperation extends DataOperation {
    readonly operation: "and";
    readonly value: number;
}

/**
 * @category Data Operations
 */
export interface OrOperation extends DataOperation {
    readonly operation: "or";
    readonly value: number;
}

/**
 * @category Data Operations
 */
export interface XorOperation extends DataOperation {
    readonly operation: "xor";
    readonly value: number;
}

/**
 * @category Data Operations
 */
export interface LeftShiftOperation extends DataOperation {
    readonly operation: "left_shift";
    readonly value: number;
}

/**
 * @category Data Operations
 */
export interface RightShiftOperation extends DataOperation {
    readonly operation: "right_shift";
    readonly value: number;
}
