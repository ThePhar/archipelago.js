import { clientStatuses } from "../../constants.ts";

/**
 * Sent to the server to update on the client's status. Examples include readiness or goal completion.
 * @category Network Packets
 */
export interface StatusUpdatePacket {
    readonly cmd: "StatusUpdate"

    /**
     * The new client status value to set this slot to. See {@link clientStatuses} for all known values.
     * @remarks This packet is ignored if the client status was set to {@link clientStatuses.goal}.
     */
    readonly status: typeof clientStatuses[keyof typeof clientStatuses]
}
