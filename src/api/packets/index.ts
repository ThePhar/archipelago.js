import { BouncePacket } from "./client/Bounce.ts";
import { ConnectPacket } from "./client/Connect.ts";
import { ConnectUpdatePacket } from "./client/ConnectUpdate.ts";
import { GetPacket } from "./client/Get.ts";
import { GetDataPackagePacket } from "./client/GetDataPackage.ts";
import { LocationChecksPacket } from "./client/LocationChecks.ts";
import { LocationScoutsPacket } from "./client/LocationScouts.ts";
import { SayPacket } from "./client/SayPacket.ts";
import { SetPacket } from "./client/Set.ts";
import { SetNotifyPacket } from "./client/SetNotify.ts";
import { StatusUpdatePacket } from "./client/StatusUpdate.ts";
import { SyncPacket } from "./client/Sync.ts";
import { BouncedPacket } from "./server/Bounced.ts";
import { ConnectedPacket } from "./server/Connected.ts";
import { ConnectionRefusedPacket } from "./server/ConnectionRefused.ts";
import { DataPackagePacket } from "./server/DataPackage.ts";
import { InvalidPacketPacket } from "./server/InvalidPacket.ts";
import { LocationInfoPacket } from "./server/LocationInfo.ts";
import { PrintJSONPacket } from "./server/PrintJSON.ts";
import { ReceivedItemsPacket } from "./server/ReceivedItems.ts";
import { RetrievedPacket } from "./server/Retrieved.ts";
import { RoomInfoPacket } from "./server/RoomInfo.ts";
import { RoomUpdatePacket } from "./server/RoomUpdate.ts";
import { SetReplyPacket } from "./server/SetReply.ts";

export * from "./client/Bounce.ts";
export * from "./client/Connect.ts";
export * from "./client/ConnectUpdate.ts";
export * from "./client/Get.ts";
export * from "./client/GetDataPackage.ts";
export * from "./client/LocationChecks.ts";
export * from "./client/LocationScouts.ts";
export * from "./client/SayPacket.ts";
export * from "./client/Set.ts";
export * from "./client/SetNotify.ts";
export * from "./client/StatusUpdate.ts";
export * from "./client/Sync.ts";
export * from "./server/Bounced.ts";
export * from "./server/Connected.ts";
export * from "./server/ConnectionRefused.ts";
export * from "./server/DataPackage.ts";
export * from "./server/InvalidPacket.ts";
export * from "./server/LocationInfo.ts";
export * from "./server/PrintJSON.ts";
export * from "./server/ReceivedItems.ts";
export * from "./server/Retrieved.ts";
export * from "./server/RoomInfo.ts";
export * from "./server/RoomUpdate.ts";
export * from "./server/SetReply.ts";

export type ClientPacket =
    | BouncePacket
    | ConnectPacket
    | ConnectUpdatePacket
    | GetPacket
    | GetDataPackagePacket
    | LocationChecksPacket
    | LocationScoutsPacket
    | SayPacket
    | SetPacket
    | SetNotifyPacket
    | StatusUpdatePacket
    | SyncPacket;

export type ServerPacket =
    | BouncedPacket
    | ConnectedPacket
    | ConnectionRefusedPacket
    | DataPackagePacket
    | InvalidPacketPacket
    | LocationInfoPacket
    | PrintJSONPacket
    | ReceivedItemsPacket
    | RetrievedPacket
    | RoomInfoPacket
    | RoomUpdatePacket
    | SetReplyPacket;
