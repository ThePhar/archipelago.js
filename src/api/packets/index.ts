import { BouncedPacket } from "./BouncedPacket";
import { BouncePacket } from "./BouncePacket";
import { ConnectedPacket } from "./ConnectedPacket";
import { ConnectionRefusedPacket } from "./ConnectionRefusedPacket";
import { ConnectPacket } from "./ConnectPacket";
import { ConnectUpdatePacket } from "./ConnectUpdatePacket";
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
 * A type union of all known and supported Archipelago client packets.
 * @internal
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
 * @internal
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

export type {
    BouncedPacket,
    BouncePacket,
    ConnectedPacket,
    ConnectionRefusedPacket,
    ConnectPacket,
    ConnectUpdatePacket,
    DataPackagePacket,
    GetDataPackagePacket,
    GetPacket,
    InvalidPacketPacket,
    LocationChecksPacket,
    LocationInfoPacket,
    LocationScoutsPacket,
    PrintJSONPacket,
    ReceivedItemsPacket,
    RetrievedPacket,
    RoomInfoPacket,
    RoomUpdatePacket,
    SayPacket,
    SetNotifyPacket,
    SetPacket,
    SetReplyPacket,
    StatusUpdatePacket,
    SyncPacket,
};
