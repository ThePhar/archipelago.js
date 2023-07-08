/**
 * A type union of all basic JSON-compatible types that are compatible with the Archipelago server.
 */
export type APBaseType = string | number | boolean | null | undefined | object;

/**
 * A type union including array versions of any base type along with standard types.
 */
export type APType = APBaseType | APBaseType[];
