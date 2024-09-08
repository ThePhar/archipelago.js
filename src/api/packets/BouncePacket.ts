import { ClientPacketType } from "../enums/CommandPacketTypes";
import { JSONSerializableData } from "../types/JSONSerializableData";

/**
 * Sent by the client to have the server forward data to all clients that satisfy any given search criteria.
 * @internal
 * @category Client Packets
 */
export interface BouncePacket {
    readonly cmd: ClientPacketType.Bounce

    /** Any data you want to send. */
    readonly data: JSONSerializableData

    /** Optional. Game names that should receive this message. */
    readonly games?: string[]

    /** Optional. Player IDs that should receive this message. */
    readonly slots?: number[]

    /** Optional. Client tags that should receive this message. */
    readonly tags?: string[]
}
