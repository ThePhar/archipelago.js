import { JSONSerializableData } from "../../types.ts";

/**
 * Sent to clients after a client requested this message be sent to them, more info in the {@link BouncePacket}.
 * @category Network Packets
 */
export interface BouncedPacket {
    readonly cmd: "Bounced"

    /** Optional. Game names this message is targeting. */
    readonly games?: string[]

    /** Optional. Player slot IDs that this message is targeting. */
    readonly slots?: number[]

    /** Optional. Client tags this message is targeting. */
    readonly tags?: string[]

    /** A verbatim copy of the data in the {@link BouncePacket} package. */
    readonly data: JSONSerializableData
}
