import { ClientStatus } from "../../enums/ClientStatus.ts";

/**
 * Sent to the server to update on the client's status. Examples include readiness or goal completion.
 * @category Client Packets
 */
export type StatusUpdatePacket = {
    readonly cmd: "StatusUpdate"

    /** One of {@link ClientStatus} enumerations. See link for more information. */
    readonly status: ClientStatus
}
