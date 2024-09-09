import { ConnectionError } from "../../types/ConnectionError.ts";

/**
 * Sent to clients when the server refuses connection. This is sent during the initial connection handshake.
 * @category Server Packets
 */
export type ConnectionRefusedPacket = {
    readonly cmd: "ConnectionRefused"

    /**
     * Optional. When provided, should contain one or more {@link ConnectionError} values. See {@link ConnectionError}
     * for additional information on what each error means.
     */
    readonly errors?: ConnectionError[]
};
