import { APBaseObject, APType } from "./__base";

export interface DataOperation extends APBaseObject {
    readonly operation: string;
    readonly value: APType;
}

export interface ReplaceOperation extends DataOperation {
    readonly operation: "replace";
}

export interface DefaultOperation extends DataOperation {
    readonly operation: "default";
}

export interface AddOperation extends DataOperation {
    readonly operation: "add";
    readonly value: number;
}

export interface MultiplyOperation extends DataOperation {
    readonly operation: "mul";
    readonly value: number;
}

export interface PowerOperation extends DataOperation {
    readonly operation: "pow";
    readonly value: number;
}

export interface ModuloOperation extends DataOperation {
    readonly operation: "mod";
    readonly value: number;
}

export interface MaxOperation extends DataOperation {
    readonly operation: "max";
    readonly value: number;
}

export interface MinOperation extends DataOperation {
    readonly operation: "min";
    readonly value: number;
}

export interface AndOperation extends DataOperation {
    readonly operation: "and";
    readonly value: number;
}

export interface OrOperation extends DataOperation {
    readonly operation: "or";
    readonly value: number;
}

export interface XorOperation extends DataOperation {
    readonly operation: "xor";
    readonly value: number;
}

export interface LeftShiftOperation extends DataOperation {
    readonly operation: "left_shift";
    readonly value: number;
}

export interface RightShiftOperation extends DataOperation {
    readonly operation: "right_shift";
    readonly value: number;
}
