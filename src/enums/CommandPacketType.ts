/**
 * An enumeration of all possible packet types the server and client can send back and forth. See each packet's
 * interface page for additional information on each packet type.
 */
export const enum CommandPacketType {
    // Client Packets
    BOUNCE = "Bounce",
    CONNECT = "Connect",
    CONNECT_UPDATE = "ConnectUpdate",
    GET_DATA_PACKAGE = "GetDataPackage",
    GET = "Get",
    LOCATION_CHECKS = "LocationChecks",
    LOCATION_SCOUTS = "LocationScouts",
    SAY = "Say",
    SET_NOTIFY = "SetNotify",
    SET = "Set",
    STATUS_UPDATE = "StatusUpdate",
    SYNC = "Sync",

    // Server Packets
    BOUNCED = "Bounced",
    CONNECTED = "Connected",
    CONNECTION_REFUSED = "ConnectionRefused",
    DATA_PACKAGE = "DataPackage",
    INVALID_PACKET = "InvalidPacket",
    LOCATION_INFO = "LocationInfo",
    PRINT_JSON = "PrintJSON",
    RECEIVED_ITEMS = "ReceivedItems",
    RETRIEVED = "Retrieved",
    ROOM_INFO = "RoomInfo",
    ROOM_UPDATE = "RoomUpdate",
    SET_REPLY = "SetReply",
}
