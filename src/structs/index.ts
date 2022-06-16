// Bounce Data
export * from "./bounce";

// All other exports.
export * from "./SlotCredentials";
export * from "./DataOperations";
export * from "./DataPackageObject";
export * from "./GameData";
export * from "./JSONMessagePart";
export * from "./NetworkItem";
export * from "./NetworkPlayer";
export * from "./NetworkSlot";
export * from "./NetworkVersion";

/**
 * A type union of all basic JSON-compatible types that are compatible with the Archipelago server.
 */
export type APBaseType = string | number | boolean | null | undefined | APBaseObject;

/**
 * A type union including array versions of any base type along with standard types.
 */
export type APType = APBaseType | APBaseType[];

/**
 * All archipelago objects derive this interface.
 */
export interface APBaseObject {
    /**
     * All AP objects are allowed to have a class key which contains content data information. Only known
     * {@link APBaseObject}-derived object that requires this key is {@link NetworkVersion}. Otherwise it is ignored.
     */
    class?: string;
}
