import * as NetworkProtocol from "./api";
import { ArchipelagoClient } from "./ArchipelagoClient";
import { CommonTags } from "./consts/CommonTags";
import { ConnectionStatus } from "./enums/ConnectionStatus";
import { SocketManager } from "./managers/SocketManager";

export {
    ArchipelagoClient,
    CommonTags,
    ConnectionStatus,
    NetworkProtocol,
};

export type {
    SocketManager,
};

export default ArchipelagoClient;
