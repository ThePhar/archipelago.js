import { ConnectionError } from "../../types.ts";

/**
 * Sent to clients when the server refuses connection. This is sent during the initial connection handshake.
 * @category Network Packets
 */
export interface ConnectionRefusedPacket {
    readonly cmd: "ConnectionRefused"

    /**
     * Optional. When provided, should contain one or more {@link ConnectionError} values. See {@link ConnectionError}
     * for additional information on what each error means.
     */
    readonly errors?: ConnectionError[]
}
