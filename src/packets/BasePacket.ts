import * as Packets from "./index";
import { CommandPacketType } from "../enums";

/**
 * The base packet structure for all packets.
 *
 * @category Server Packets
 * @category Client Packets
 */
export interface BasePacket {
    /** The type of packet this is. */
    readonly cmd: CommandPacketType;
}

/**
 * A type union of all known and supported Archipelago client packets.
 */
export type ArchipelagoClientPacket =
    | Packets.BouncePacket
    | Packets.ConnectPacket
    | Packets.ConnectUpdatePacket
    | Packets.GetDataPackagePacket
    | Packets.GetPacket
    | Packets.LocationChecksPacket
    | Packets.LocationScoutsPacket
    | Packets.SayPacket
    | Packets.SetNotifyPacket
    | Packets.SetPacket
    | Packets.StatusUpdatePacket
    | Packets.SyncPacket;

/**
 * A type union of all known and supported Archipelago server packets.
 */
export type ArchipelagoServerPacket =
    | Packets.BouncedPacket
    | Packets.ConnectionRefusedPacket
    | Packets.ConnectedPacket
    | Packets.DataPackagePacket
    | Packets.InvalidPacketPacket
    | Packets.LocationInfoPacket
    | Packets.PrintJSONPacket
    | Packets.ReceivedItemsPacket
    | Packets.RetrievedPacket
    | Packets.RoomInfoPacket
    | Packets.RoomUpdatePacket
    | Packets.SetReplyPacket;

/**
 * A type union of all known and supported Archipelago packets.
 */
export type ArchipelagoPacket = ArchipelagoClientPacket | ArchipelagoServerPacket;
