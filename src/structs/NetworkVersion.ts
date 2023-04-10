/**
 * An object representing software versioning. Used in the {@link ConnectPacket} to allow the client to inform the
 * server the minimum Archipelago version it supports.
 */
export interface NetworkVersion {
    major: number;
    minor: number;
    build: number;
}
