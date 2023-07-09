import { JSONSerializableData } from "./JSONSerializableData";

/**
 * A stand in for unknown slot data.
 */
export type SlotData = {
    [arg: string]: JSONSerializableData;
};

// For backwards compatibility.
export type UnknownSlotData = SlotData;
