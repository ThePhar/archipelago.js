import { BouncedPacket } from "./BouncedPacket.ts";
import { BouncePacket } from "./BouncePacket.ts";
import { ConnectedPacket } from "./ConnectedPacket.ts";
import { ConnectionRefusedPacket } from "./ConnectionRefusedPacket.ts";
import { ConnectPacket } from "./ConnectPacket.ts";
import { ConnectUpdatePacket } from "./ConnectUpdatePacket.ts";
import { DataPackagePacket } from "./DataPackagePacket.ts";
import { GetDataPackagePacket } from "./GetDataPackagePacket.ts";
import { GetPacket } from "./GetPacket.ts";
import { InvalidPacketPacket } from "./InvalidPacketPacket.ts";
import { LocationChecksPacket } from "./LocationChecksPacket.ts";
import { LocationInfoPacket } from "./LocationInfoPacket.ts";
import { LocationScoutsPacket } from "./LocationScoutsPacket.ts";
import { PrintJSONPacket } from "./PrintJSONPacket.ts";
import { ReceivedItemsPacket } from "./ReceivedItemsPacket.ts";
import { RetrievedPacket } from "./RetrievedPacket.ts";
import { RoomInfoPacket } from "./RoomInfoPacket.ts";
import { RoomUpdatePacket } from "./RoomUpdatePacket.ts";
import { SayPacket } from "./SayPacket.ts";
import { SetNotifyPacket } from "./SetNotifyPacket.ts";
import { SetPacket } from "./SetPacket.ts";
import { SetReplyPacket } from "./SetReplyPacket.ts";
import { StatusUpdatePacket } from "./StatusUpdatePacket.ts";
import { SyncPacket } from "./SyncPacket.ts";

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
