import { ServerPacketType } from "../enums/CommandPacketTypes";
import { DataPackage } from "../types/DataPackage";

/**
 * Sent to clients to provide what is known as a 'data package' which contains information to enable a client to most
 * easily communicate with the Archipelago server. Contents include things like location id to name mappings, among
 * others; see {@link DataPackage} for more info.
 * @internal
 * @category Server Packets
 */
export interface DataPackagePacket {
    readonly cmd: ServerPacketType.DataPackage

    /** The data package as an object of {@link DataPackage}. */
    readonly data: DataPackage
}