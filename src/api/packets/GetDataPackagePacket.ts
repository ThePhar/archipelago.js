/**
 * Sent by the client to request the data package from the server. Does not require client authentication. Sent
 * automatically during {@link Client.connect}.
 * @internal
 * @category Client Packets
 */
export interface GetDataPackagePacket {
    readonly cmd: "GetDataPackage"

    /**
     * Optional. If specified, will only send back the specified data.
     * @remarks It is recommended to only request required data to reduce network bandwidth costs.
     */
    readonly games?: string[]
}
