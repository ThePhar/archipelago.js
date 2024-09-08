import { ServerPacketType } from "../enums/CommandPacketTypes";
import { ConnectionError } from "../enums/ConnectionError";

/**
 * Sent to clients when the server refuses connection. This is sent during the initial connection handshake.
 * @internal
 * @category Server Packets
 */
export interface ConnectionRefusedPacket {
    readonly cmd: ServerPacketType.ConnectionRefused

    /**
     * Optional. When provided, should contain any one of the following {@link ConnectionError} enumerations or other
     * errors. See {@link ConnectionError} for additional information on what each error means.
     */
    readonly errors?: (string | ConnectionError)[]
}
