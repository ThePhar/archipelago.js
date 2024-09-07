import { PacketProblemType } from "../enums/PacketProblemType";

/** @internal */
export interface InvalidCommandPacketPacket {
    readonly cmd: "InvalidPacket"

    /** The {@link PacketProblemType} that was detected in the packet. */
    readonly type: PacketProblemType.Command

    /** The `cmd` argument of the faulty packet. */
    readonly original_cmd: string

    /** A descriptive message of the problem at hand. */
    readonly text: string
}

/** @internal */
export interface InvalidArgumentsPacketPacket {
    readonly cmd: "InvalidPacket"

    /** The {@link PacketProblemType} that was detected in the packet. */
    readonly type: PacketProblemType.Arguments

    /** A descriptive message of the problem at hand. */
    readonly text: string
}

/**
 * Sent to clients if the server caught a problem with a packet. This only occurs for errors that are explicitly checked
 * for.
 * @internal
 * @category Server Packets
 */
export type InvalidPacketPacket = InvalidCommandPacketPacket | InvalidArgumentsPacketPacket;
