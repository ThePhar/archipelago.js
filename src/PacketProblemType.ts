/**
 * PacketProblemType indicates the type of problem that was detected in the faulty packet, the known problem types are
 * below but others may be added in the future.
 */
export enum PacketProblemType {
    /** `cmd` argument of the faulty packet that could not be parsed correctly. */
    CMD = "cmd",

    /** Arguments of the faulty packet which were not correct. */
    ARGUMENTS = "arguments",
}
