import { JSONSerializableData } from "./JSONSerializableData.ts";

/**
 * A stand in for unknown slot data.
 * @internal
 */
export type AbstractSlotData = {
    [arg: string]: JSONSerializableData
};
