import { ClientStatus, CommandPacketType } from "../../enums";
import { BasePacket } from "../index";

/**
 * Sent to the server to update on the client's status. Examples include readiness or goal completion. (Example:
 * Defeated Ganon in `A Link to the Past`)
 *
 * @category Client Packets
 */
export interface StatusUpdatePacket extends BasePacket {
    cmd: CommandPacketType.STATUS_UPDATE;

    /** One of {@link ClientStatus} enumerations. See link for more information. */
    status: ClientStatus;
}
