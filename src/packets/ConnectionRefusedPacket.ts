import { ConnectionError } from "../consts/ConnectionError.ts";
import { BaseServerPacket } from "./BasePackets.ts";

/**
 * Sent to clients when the server refuses connection. This is sent during the initial connection handshake.
 *
 * @category Server Packets
 */
export interface ConnectionRefusedPacket extends BaseServerPacket {
    cmd: "ConnectionRefused";

    /**
     * Optional. When provided, should contain any one of the following {@link ConnectionError} enumerations or other
     * errors. See {@link ConnectionError} for additional information on what each error means.
     */
    errors?: (string | ConnectionError)[];
}
