import { JSONSerializableData } from "./JSONSerializableData";

/**
 * A stand in for unknown slot data.
 * @internal
 */
export type SlotData = {
    [arg: string]: JSONSerializableData
};
