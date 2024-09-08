import * as NetworkProtocol from "./api/index.ts";
import { ArchipelagoClient } from "./ArchipelagoClient.ts";
import { CommonTags } from "./consts/CommonTags.ts";
import { ConnectionStatus } from "./enums/ConnectionStatus.ts";
import { SocketManager } from "./managers/SocketManager.ts";

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
