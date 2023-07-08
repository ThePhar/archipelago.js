/**
 * An object representing software versioning. Used in the {@link ConnectPacket} to allow the client to inform the
 * server the minimum Archipelago version it supports.
 */
export type NetworkVersion = {
    /** Always required for Archipelago to parse NetworkVersion data. */
    class: "Version";
    major: number;
    minor: number;
    build: number;
};
