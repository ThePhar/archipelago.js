import { ClientStatus } from "../consts/ClientStatus";
import { BaseClientPacket } from "./BasePackets";

/**
 * Sent to the server to update on the client's status. Examples include readiness or goal completion. (Example:
 * Defeated Ganon in `A Link to the Past`)
 *
 * @category Client Packets
 */
export interface StatusUpdatePacket extends BaseClientPacket {
    cmd: "StatusUpdate";

    /** One of {@link ClientStatus} enumerations. See link for more information. */
    status: ClientStatus;
}
