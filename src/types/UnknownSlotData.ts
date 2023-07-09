import { JSONSerializableData } from "./JSONSerializableData";

/**
 * A stand in for unknown slot data.
 */
export type UnknownSlotData = {
    [arg: string]: JSONSerializableData;
};
