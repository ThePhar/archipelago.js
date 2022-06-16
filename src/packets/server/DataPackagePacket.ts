import { CommandPacketType } from "../../enums";
import { DataPackageObject } from "../../structs";
import { BasePacket } from "../index";

/**
 * Sent to clients to provide what is known as a 'data package' which contains information to enable a client to most
 * easily communicate with the Archipelago server. Contents include things like location id to name mappings, among
 * others; see {@link DataPackageObject} for more info.
 *
 * @category Server Packets
 */
export interface DataPackagePacket extends BasePacket {
    cmd: CommandPacketType.DATA_PACKAGE;

    /** The data package as an object of {@link DataPackageObject}s. */
    data: DataPackageObject;
}
