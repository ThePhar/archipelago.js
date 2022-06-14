import { CommandPacketType } from "@enums";
import * as Packets from "@packets";

export interface BasePacket {
    readonly cmd: CommandPacketType;
}

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

export type ArchipelagoServerPacket =
    | Packets.BouncedPacket
    | Packets.ConnectionRefusedPacket
    | Packets.ConnectedPacket
    | Packets.DataPackagePacket
    | Packets.InvalidPacketPacket
    | Packets.LocationInfoPacket
    | Packets.PrintJSONPacket
    | Packets.PrintPacket
    | Packets.ReceivedItemsPacket
    | Packets.RetrievedPacket
    | Packets.RoomInfoPacket
    | Packets.RoomUpdatePacket
    | Packets.SetReplyPacket;

export type ArchipelagoPacket = ArchipelagoClientPacket | ArchipelagoServerPacket;
