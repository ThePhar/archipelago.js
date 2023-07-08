import { BaseClientPacket } from "./BasePackets.ts";

/**
 * Sent by the client to request the data package from the server. Does not require client authentication. Sent
 * automatically during {@link Client.connect}.
 *
 * @category Client Packets
 */
export interface GetDataPackagePacket extends BaseClientPacket {
    cmd: "GetDataPackage";

    /**
     * Optional. If specified, will only send back the specified data. Such as, `["Factorio"]` ➔
     * {@link DataPackagePacket} with only Factorio game data.
     */
    games?: string[];
}
