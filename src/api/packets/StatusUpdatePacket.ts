import { ClientStatus } from "../enums/ClientStatus";

/**
 * Sent to the server to update on the client's status. Examples include readiness or goal completion. (Example:
 * Defeated Ganon in `A Link to the Past`)
 * @internal
 * @category Client Packets
 */
export interface StatusUpdatePacket {
    readonly cmd: "StatusUpdate"

    /** One of {@link ClientStatus} enumerations. See link for more information. */
    readonly status: ClientStatus
}
