// Bounce Data
export * from "./bounce";

// All other exports.
export * from "./DataOperations";
export * from "./DataPackageObject";
export * from "./GameData";
export * from "./JSONMessagePart";
export * from "./NetworkItem";
export * from "./NetworkPlayer";
export * from "./NetworkSlot";
export * from "./NetworkVersion";

export type APBaseType = string | number | boolean | null | undefined | APBaseObject;
export type APType = APBaseType | APBaseType[];

// Base Object definition
export interface APBaseObject {
    readonly class?: string;
}
