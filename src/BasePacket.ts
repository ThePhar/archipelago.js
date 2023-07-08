import { ClientPacketType, ServerPacketType } from "./CommandPacketType.ts";
import { ConnectPacket } from "./ConnectPacket.ts";
import { BouncePacket } from "./BouncePacket.ts";
import { GetDataPackagePacket } from "./GetDataPackagePacket.ts";
import { GetPacket } from "./GetPacket.ts";
import { LocationChecksPacket } from "./LocationChecksPacket.ts";
import { LocationScoutsPacket } from "./LocationScoutsPacket.ts";
import { SayPacket } from "./SayPacket.ts";
import { SetNotifyPacket } from "./SetNotifyPacket.ts";
import { SetPacket } from "./SetPacket.ts";
import { StatusUpdatePacket } from "./StatusUpdatePacket.ts";
import { SyncPacket } from "./SyncPacket.ts";
import { BouncedPacket } from "./BouncedPacket.ts";
import { ConnectionRefusedPacket } from "./ConnectionRefusedPacket.ts";
import { ConnectedPacket } from "./ConnectedPacket.ts";
import { DataPackagePacket } from "./DataPackagePacket.ts";
import { ConnectUpdatePacket } from "./ConnectUpdatePacket.ts";
import { InvalidPacketPacket } from "./InvalidPacketPacket.ts";
import { LocationInfoPacket } from "./LocationInfoPacket.ts";
import { PrintJSONPacket } from "./PrintJSONPacket.ts";
import { ReceivedItemsPacket } from "./ReceivedItemsPacket.ts";
import { RetrievedPacket } from "./RetrievedPacket.ts";
import { RoomInfoPacket } from "./RoomInfoPacket.ts";
import { RoomUpdatePacket } from "./RoomUpdatePacket.ts";
import { SetReplyPacket } from "./SetReplyPacket.ts";

/**
 * The base packet structure for all client packets.
 *
 * @category Client Packets
 */
export interface ClientPacket {
    /** The type of packet this is. */
    readonly cmd: ClientPacketType;
}

/**
 * The base packet structure for all server packets.
 *
 * @category Server Packets
 */
export interface ServerPacket {
    /** The type of packet this is. */
    readonly cmd: ServerPacketType;
}

/**
 * A type union of all known and supported Archipelago client packets.
 */
export type ArchipelagoClientPacket =
    | BouncePacket
    | ConnectPacket
    | ConnectUpdatePacket
    | GetDataPackagePacket
    | GetPacket
    | LocationChecksPacket
    | LocationScoutsPacket
    | SayPacket
    | SetNotifyPacket
    | SetPacket
    | StatusUpdatePacket
    | SyncPacket;

/**
 * A type union of all known and supported Archipelago server packets.
 */
export type ArchipelagoServerPacket =
    | BouncedPacket
    | ConnectionRefusedPacket
    | ConnectedPacket
    | DataPackagePacket
    | InvalidPacketPacket
    | LocationInfoPacket
    | PrintJSONPacket
    | ReceivedItemsPacket
    | RetrievedPacket
    | RoomInfoPacket
    | RoomUpdatePacket
    | SetReplyPacket;

/**
 * A type union of all known and supported Archipelago packets.
 */
export type ArchipelagoPacket = ArchipelagoClientPacket | ArchipelagoServerPacket;
