import { ServerPacket } from "./BasePacket.ts";
import { ServerPacketType } from "./CommandPacketType.ts";
import { DataPackageObject } from "./DataPackageObject.ts";

/**
 * Sent to clients to provide what is known as a 'data package' which contains information to enable a client to most
 * easily communicate with the Archipelago server. Contents include things like location id to name mappings, among
 * others; see {@link DataPackageObject} for more info.
 *
 * @category Server Packets
 */
export interface DataPackagePacket extends ServerPacket {
    cmd: ServerPacketType.DATA_PACKAGE;

    /** The data package as an object of {@link DataPackageObject}. */
    data: DataPackageObject;
}
