import { ClientStatus } from "../enums/ClientStatus.ts";
import { ClientPacketType } from "../enums/CommandPacketTypes.ts";

/**
 * Sent to the server to update on the client's status. Examples include readiness or goal completion.
 * @internal
 * @category Client Packets
 */
export interface StatusUpdatePacket {
    readonly cmd: ClientPacketType.StatusUpdate

    /** One of {@link ClientStatus} enumerations. See link for more information. */
    readonly status: ClientStatus
}
