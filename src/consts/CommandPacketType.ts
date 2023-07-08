import { ObjectValues } from "../types/ObjectValues.ts";

/**
 * A const of all possible packet types the server can send to the client. See each packet's documentation page for
 * additional information on each packet type.
 */
export const SERVER_PACKET_TYPE = {
    BOUNCED: "Bounced",
    CONNECTED: "Connected",
    CONNECTION_REFUSED: "ConnectionRefused",
    DATA_PACKAGE: "DataPackage",
    INVALID_PACKET: "InvalidPacket",
    LOCATION_INFO: "LocationInfo",
    PRINT_JSON: "PrintJSON",
    RECEIVED_ITEMS: "ReceivedItems",
    RETRIEVED: "Retrieved",
    ROOM_INFO: "RoomInfo",
    ROOM_UPDATE: "RoomUpdate",
    SET_REPLY: "SetReply",
} as const;

/**
 * A const of all possible packet types the client can send to the server. See each packet's documentation page for
 * additional information on each packet type.
 */
export const CLIENT_PACKET_TYPE = {
    BOUNCE: "Bounce",
    CONNECT: "Connect",
    CONNECT_UPDATE: "ConnectUpdate",
    GET_DATA_PACKAGE: "GetDataPackage",
    GET: "Get",
    LOCATION_CHECKS: "LocationChecks",
    LOCATION_SCOUTS: "LocationScouts",
    SAY: "Say",
    SET_NOTIFY: "SetNotify",
    SET: "Set",
    STATUS_UPDATE: "StatusUpdate",
    SYNC: "Sync",
} as const;

export type ServerPacketType = ObjectValues<typeof SERVER_PACKET_TYPE>;
export type ClientPacketType = ObjectValues<typeof CLIENT_PACKET_TYPE>;
