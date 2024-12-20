import { JSONRecord } from "../../types.ts";

/**
 * Sent by the client to be broadcast from the server to all connected clients that match any one of the filter
 * arguments.
 * @remarks Useful for commonly implemented features such as `DeathLink`.
 * @category Network Packets
 */
export interface BouncePacket {
    readonly cmd: "Bounce"

    /** Any data you want to send. */
    readonly data: JSONRecord

    /** Optional. Games that should receive this message. */
    readonly games?: string[]

    /** Optional. Player ids that should receive this message. */
    readonly slots?: number[]

    /** Optional. Client tags that should receive this message. */
    readonly tags?: string[]
}
