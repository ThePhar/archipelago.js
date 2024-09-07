/**
 * An enum of all possible packet types the server can send to the client. See each packet's documentation page for
 * additional information on each packet type.
 * @internal
 */
export const enum ServerPacketType {
    Bounced = "Bounced",
    Connected = "Connected",
    ConnectionRefused = "ConnectionRefused",
    DataPackage = "DataPackage",
    InvalidPacket = "InvalidPacket",
    LocationInfo = "LocationInfo",
    PrintJSON = "PrintJSON",
    ReceivedItems = "ReceivedItems",
    Retrieved = "Retrieved",
    RoomInfo = "RoomInfo",
    RoomUpdate = "RoomUpdate",
    SetReply = "SetReply",
}

/**
 * An enum of all possible packet types the client can send to the server. See each packet's documentation page for
 * additional information on each packet type.
 * @internal
 */
export const enum ClientPacketType {
    Bounce = "Bounce",
    Connect = "Connect",
    ConnectUpdate = "ConnectUpdate",
    GetDataPackage = "GetDataPackage",
    Get = "Get",
    LocationChecks = "LocationChecks",
    LocationScouts = "LocationScouts",
    Say = "Say",
    SetNotify = "SetNotify",
    Set = "Set",
    StatusUpdate = "StatusUpdate",
    Sync = "Sync",
}
