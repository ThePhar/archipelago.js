import { CommandPacketType } from "@enums";
import { BasePacket } from "@packets";

/**
 * Sent by the client to request the data package from the server. Does not require client authentication. Sent
 * automatically during {@link ArchipelagoClient.connect}.
 *
 * @category Client Packets
 */
export interface GetDataPackagePacket extends BasePacket {
    cmd: CommandPacketType.GET_DATA_PACKAGE;

    /**
     * Optional. If specified, will only send back the specified data. Such as, `["Factorio"]` ➔
     * {@link DataPackagePacket} with only Factorio data.
     */
    games?: string[];
}
