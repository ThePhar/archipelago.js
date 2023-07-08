import { ClientPacketType } from "../../enums";
import { ClientPacket } from "../index";

/**
 * Sent by the client to request the data package from the server. Does not require client authentication. Sent
 * automatically during {@link Client.connect}.
 *
 * @category Client Packets
 */
export interface GetDataPackagePacket extends ClientPacket {
    cmd: ClientPacketType.GET_DATA_PACKAGE;

    /**
     * Optional. If specified, will only send back the specified data. Such as, `["Factorio"]` ➔
     * {@link DataPackagePacket} with only Factorio data.
     */
    games?: string[];
}
