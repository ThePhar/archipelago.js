export * as API from "./api/index.ts";
export { ArchipelagoClient } from "./ArchipelagoClient.ts";
export { CommonTags } from "./consts/CommonTags.ts";
export { ConnectionStatus } from "./enums/ConnectionStatus.ts";
export { SocketManager } from "./managers/SocketManager.ts";

import { ArchipelagoClient } from "./ArchipelagoClient.ts";

export default ArchipelagoClient;
