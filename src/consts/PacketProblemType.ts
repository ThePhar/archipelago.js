import { ObjectValues } from "../types/ObjectValues";

/**
 * PacketProblemType indicates the type of problem that was detected in the faulty packet, the known problem types are
 * below but others may be added in the future.
 */
export const PACKET_PROBLEM_TYPE = {
    /** `cmd` argument of the faulty packet that could not be parsed correctly. */
    CMD: "cmd",

    /** Arguments of the faulty packet which were not correct. */
    ARGUMENTS: "arguments",
} as const;

export type PacketProblemType = ObjectValues<typeof PACKET_PROBLEM_TYPE> | string;
