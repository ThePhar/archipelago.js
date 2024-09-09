import { BouncePacket } from "./client/BouncePacket.ts";
import { ConnectPacket } from "./client/ConnectPacket.ts";
import { ConnectUpdatePacket } from "./client/ConnectUpdatePacket.ts";
import { GetDataPackagePacket } from "./client/GetDataPackagePacket.ts";
import { GetPacket } from "./client/GetPacket.ts";
import { LocationChecksPacket } from "./client/LocationChecksPacket.ts";
import { LocationScoutsPacket } from "./client/LocationScoutsPacket.ts";
import { SayPacket } from "./client/SayPacket.ts";
import { SetNotifyPacket } from "./client/SetNotifyPacket.ts";
import { SetPacket } from "./client/SetPacket.ts";
import { StatusUpdatePacket } from "./client/StatusUpdatePacket.ts";
import { SyncPacket } from "./client/SyncPacket.ts";
import { BouncedPacket } from "./server/BouncedPacket.ts";
import { ConnectedPacket } from "./server/ConnectedPacket.ts";
import { ConnectionRefusedPacket } from "./server/ConnectionRefusedPacket.ts";
import { DataPackagePacket } from "./server/DataPackagePacket.ts";
import {
    InvalidArgumentsPacketPacket,
    InvalidCommandPacketPacket,
    InvalidPacketPacket,
} from "./server/InvalidPacketPacket.ts";
import { LocationInfoPacket } from "./server/LocationInfoPacket.ts";
import {
    AdminCommandResultJSONPacket,
    ChatJSONPacket,
    CollectJSONPacket,
    CommandResultJSONPacket,
    CountdownJSONPacket,
    GoalJSONPacket,
    HintJSONPacket,
    ItemCheatJSONPacket,
    ItemSendJSONPacket,
    JoinJSONPacket,
    PartJSONPacket,
    PrintJSONPacket,
    ReleaseJSONPacket,
    ServerChatJSONPacket,
    TagsChangedJSONPacket,
    TutorialJSONPacket,
} from "./server/PrintJSONPacket.ts";
import { ReceivedItemsPacket } from "./server/ReceivedItemsPacket.ts";
import { RetrievedPacket } from "./server/RetrievedPacket.ts";
import { RoomInfoPacket } from "./server/RoomInfoPacket.ts";
import { RoomUpdatePacket } from "./server/RoomUpdatePacket.ts";
import { SetReplyPacket } from "./server/SetReplyPacket.ts";

/**
 * A union of all known and supported Archipelago client packets.
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
 * A union of all known and supported Archipelago server packets.
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
 * A union of all possible packet types the server can send to the client. See each packet's documentation page for
 * additional information on each packet type.
 */
export type ServerPacketType =
    | "Bounced"
    | "Connected"
    | "ConnectionRefused"
    | "DataPackage"
    | "InvalidPacket"
    | "LocationInfo"
    | "PrintJSON"
    | "ReceivedItems"
    | "Retrieved"
    | "RoomInfo"
    | "RoomUpdate"
    | "SetReply";

/**
 * A union of all possible packet types the client can send to the server. See each packet's documentation page for
 * additional information on each packet type.
 */
export type ClientPacketType =
    | "Bounce"
    | "Connect"
    | "ConnectUpdate"
    | "GetDataPackage"
    | "Get"
    | "LocationChecks"
    | "LocationScouts"
    | "Say"
    | "SetNotify"
    | "Set"
    | "StatusUpdate"
    | "Sync";

export type {
    AdminCommandResultJSONPacket,
    BouncedPacket,
    BouncePacket,
    ChatJSONPacket,
    CollectJSONPacket,
    CommandResultJSONPacket,
    ConnectedPacket,
    ConnectionRefusedPacket,
    ConnectPacket,
    ConnectUpdatePacket,
    CountdownJSONPacket,
    DataPackagePacket,
    GetDataPackagePacket,
    GetPacket,
    GoalJSONPacket,
    HintJSONPacket,
    InvalidArgumentsPacketPacket,
    InvalidCommandPacketPacket,
    InvalidPacketPacket,
    ItemCheatJSONPacket,
    ItemSendJSONPacket,
    JoinJSONPacket,
    LocationChecksPacket,
    LocationInfoPacket,
    LocationScoutsPacket,
    PartJSONPacket,
    PrintJSONPacket,
    ReceivedItemsPacket,
    ReleaseJSONPacket,
    RetrievedPacket,
    RoomInfoPacket,
    RoomUpdatePacket,
    SayPacket,
    ServerChatJSONPacket,
    SetNotifyPacket,
    SetPacket,
    SetReplyPacket,
    StatusUpdatePacket,
    SyncPacket,
    TagsChangedJSONPacket,
    TutorialJSONPacket,
};
