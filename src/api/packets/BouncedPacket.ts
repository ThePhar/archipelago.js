import { ServerPacketType } from "../enums/CommandPacketTypes";
import { JSONSerializableData } from "../types/JSONSerializableData";

/**
 * Sent to clients after a client requested this message be sent to them, more info in the {@link BouncePacket}.
 * @internal
 * @category Server Packets
 */
export interface BouncedPacket {
    readonly cmd: ServerPacketType.Bounced

    /** Optional. Game names this message is targeting. */
    readonly games?: string[]

    /** Optional. Player slot IDs that this message is targeting. */
    readonly slots?: number[]

    /** Optional. Client tags this message is targeting. */
    readonly tags?: string[]

    /** A verbatim copy of the data in the {@link BouncePacket} package. */
    readonly data: JSONSerializableData
}
