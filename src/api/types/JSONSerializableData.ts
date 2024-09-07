/**
 * A type union of all basic JSON-compatible types that can be communicated with or from the server.
 * @internal
 */
export type JSONSerializableData =
    | string
    | number
    | boolean
    | null
    | { [key: string]: JSONSerializableData }
    | JSONSerializableData[];
