/**
 * Sent to clients if the server caught a problem with a given packet's `cmd` property.
 * @see {@link InvalidPacketPacket} for all possible `InvalidPacket` packet subtypes.
 * @category Server Packets
 */
export type InvalidCommandPacketPacket = {
    readonly cmd: "InvalidPacket"

    /** The type of problem that was detected in the packet. */
    readonly type: "cmd"

    /** The `cmd` argument of the faulty packet. */
    readonly original_cmd: string

    /** A descriptive message of the problem at hand. */
    readonly text: string
};

/**
 * Sent to clients if the server caught a problem with a given packet's arguments.
 * @see {@link InvalidPacketPacket} for all possible `InvalidPacket` packet subtypes.
 * @category Server Packets
 */
export type InvalidArgumentsPacketPacket = {
    readonly cmd: "InvalidPacket"

    /** The type of problem that was detected in the packet. */
    readonly type: "arguments"

    /** A descriptive message of the problem at hand. */
    readonly text: string
};

/**
 * A union of possible `InvalidPacket` packets. Sent to clients if the server caught a problem with a packet. See each
 * packet subtype for more details.
 * @remarks This only occurs for errors that are explicitly checked for. All other errors will cause the server to drop
 * the connection instead.
 * @category Server Packets
 */
export type InvalidPacketPacket = InvalidCommandPacketPacket | InvalidArgumentsPacketPacket;
