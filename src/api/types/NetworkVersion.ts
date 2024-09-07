/**
 * An object representing software versioning. Used in the {@link ConnectPacket} to allow the client to inform the
 * server the minimum Archipelago version it supports.
 * @internal
 * @remarks Does not strictly follow semver versioning.
 */
export type NetworkVersion = {
    /** Always required by the Archipelago server to parse NetworkVersion data. */
    class: "Version"

    /** The major component of the version number. (e.g., X.0.0) */
    readonly major: number
    /** The minor component of the version number. (e.g., 0.X.0) */
    readonly minor: number
    /** The build/patch component of the version number. (e.g., 0.0.X) */
    readonly build: number
};
