import { BouncePacket } from "./client/bounce.ts";
import { ConnectPacket } from "./client/connect.ts";
import { ConnectUpdatePacket } from "./client/connectUpdate.ts";
import { GetPacket } from "./client/get.ts";
import { GetDataPackagePacket } from "./client/getDataPackage.ts";
import { LocationChecksPacket } from "./client/locationChecks.ts";
import { LocationScoutsPacket } from "./client/locationScouts.ts";
import { SayPacket } from "./client/say.ts";
import { SetPacket } from "./client/set.ts";
import { SetNotifyPacket } from "./client/setNotify.ts";
import { StatusUpdatePacket } from "./client/statusUpdate.ts";
import { SyncPacket } from "./client/sync.ts";
import { BouncedPacket } from "./server/bounced.ts";
import { ConnectedPacket } from "./server/connected.ts";
import { ConnectionRefusedPacket } from "./server/connectionRefused.ts";
import { DataPackagePacket } from "./server/dataPackage.ts";
import { InvalidPacketPacket } from "./server/invalidPacket.ts";
import { LocationInfoPacket } from "./server/locationInfo.ts";
import { PrintJSONPacket } from "./server/printJSON.ts";
import { ReceivedItemsPacket } from "./server/receivedItems.ts";
import { RetrievedPacket } from "./server/retrieved.ts";
import { RoomInfoPacket } from "./server/roomInfo.ts";
import { RoomUpdatePacket } from "./server/roomUpdate.ts";
import { SetReplyPacket } from "./server/setReply.ts";

export * from "./client/bounce.ts";
export * from "./client/connect.ts";
export * from "./client/connectUpdate.ts";
export * from "./client/get.ts";
export * from "./client/getDataPackage.ts";
export * from "./client/locationChecks.ts";
export * from "./client/locationScouts.ts";
export * from "./client/say.ts";
export * from "./client/set.ts";
export * from "./client/setNotify.ts";
export * from "./client/statusUpdate.ts";
export * from "./client/sync.ts";
export * from "./server/bounced.ts";
export * from "./server/connected.ts";
export * from "./server/connectionRefused.ts";
export * from "./server/dataPackage.ts";
export * from "./server/invalidPacket.ts";
export * from "./server/locationInfo.ts";
export * from "./server/printJSON.ts";
export * from "./server/receivedItems.ts";
export * from "./server/retrieved.ts";
export * from "./server/roomInfo.ts";
export * from "./server/roomUpdate.ts";
export * from "./server/setReply.ts";

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
