import { CommandPacketType, ConnectionError } from "../../enums";
import { BasePacket } from "../index";

/**
 * Sent to clients when the server refuses connection. This is sent during the initial connection handshake.
 *
 * @category Server Packets
 */
export interface ConnectionRefusedPacket extends BasePacket {
    cmd: CommandPacketType.CONNECTION_REFUSED;

    /**
     * Optional. When provided, should contain any one of the following {@link ConnectionError} enumerations or other
     * errors. See {@link ConnectionError} for additional information on what each error means.
     */
    errors?: (string | ConnectionError)[];
}
