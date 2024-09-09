/**
 * An object representing software versioning. Used in the {@link NetworkPackets.ConnectPacket} to allow the client to
 * inform the server the minimum Archipelago version it supports.
 * @remarks Archipelago does not follow a semver versioning standard.
 */
export type NetworkVersion = {
    /** Always required to be present to ensure the Archipelago server parses this object correctly. */
    readonly class: "Version"

    /** The major component of the version number. (e.g., X.0.0) */
    readonly major: number
    /** The minor component of the version number. (e.g., 0.X.0) */
    readonly minor: number
    /** The build/patch component of the version number. (e.g., 0.0.X) */
    readonly build: number
};
