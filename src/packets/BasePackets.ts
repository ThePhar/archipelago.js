import { ClientPacketType, ServerPacketType } from "../consts/CommandPacketType";
import { BouncePacket } from "./BouncePacket";
import { BouncedPacket } from "./BouncedPacket";
import { ConnectPacket } from "./ConnectPacket";
import { ConnectUpdatePacket } from "./ConnectUpdatePacket";
import { ConnectedPacket } from "./ConnectedPacket";
import { ConnectionRefusedPacket } from "./ConnectionRefusedPacket";
import { DataPackagePacket } from "./DataPackagePacket";
import { GetDataPackagePacket } from "./GetDataPackagePacket";
import { GetPacket } from "./GetPacket";
import { InvalidPacketPacket } from "./InvalidPacketPacket";
import { LocationChecksPacket } from "./LocationChecksPacket";
import { LocationInfoPacket } from "./LocationInfoPacket";
import { LocationScoutsPacket } from "./LocationScoutsPacket";
import { PrintJSONPacket } from "./PrintJSONPacket";
import { ReceivedItemsPacket } from "./ReceivedItemsPacket";
import { RetrievedPacket } from "./RetrievedPacket";
import { RoomInfoPacket } from "./RoomInfoPacket";
import { RoomUpdatePacket } from "./RoomUpdatePacket";
import { SayPacket } from "./SayPacket";
import { SetNotifyPacket } from "./SetNotifyPacket";
import { SetPacket } from "./SetPacket";
import { SetReplyPacket } from "./SetReplyPacket";
import { StatusUpdatePacket } from "./StatusUpdatePacket";
import { SyncPacket } from "./SyncPacket";

/**
 * The base packet structure for all client packets.
 *
 * @category Client Packets
 */
export interface BaseClientPacket {
    /** The type of packet this is. */
    readonly cmd: ClientPacketType;
}

/**
 * The base packet structure for all server packets.
 *
 * @category Server Packets
 */
export interface BaseServerPacket {
    /** The type of packet this is. */
    readonly cmd: ServerPacketType;
}

/**
 * A type union of all known and supported Archipelago client packets.
 */
export type ClientPacket =
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
export type ServerPacket =
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
export type ArchipelagoPacket = ClientPacket | ServerPacket;
