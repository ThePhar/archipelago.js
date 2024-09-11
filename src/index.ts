/**
 * A collection of types, constants, and enumerations that get passed over the Archipelago network protocol.
 *
 * You can read more information about the Network Protocol in the Archipelago
 * [Network Protocol](https://github.com/ArchipelagoMW/Archipelago/blob/main/docs/network%20protocol.md)
 * documentation on their GitHub repository.
 * @namespace
 * @remarks Library subscribers should utilize built-in helper methods and objects, if available, but these base types
 * are still exposed for advanced users.
 */
export * as NetworkProtocol from "./api";

/**
 * A collection of custom Error classes that may be thrown during abnormal events.
 * @namespace
 */
export * as ArchipelagoErrors from "./errors.ts";

// Normal exports.
export { CommonTags } from "./consts/CommonTags.ts";
export { APIManager } from "./managers/APIManager.ts";
export { DataPackageManager, PackageMetadata } from "./managers/DataPackageManager.ts";
export { DataStorageManager } from "./managers/DataStorageManager.ts";
export { ItemsManager } from "./managers/ItemsManager.ts";
export { LocationsManager } from "./managers/LocationsManager.ts";
export { PlayerMetadata, PlayersManager } from "./managers/PlayersManager.ts";
export { RoomManager } from "./managers/RoomManager.ts";
export { ArchipelagoClient } from "./structs/ArchipelagoClient.ts";
export { IntermediateDataOperation } from "./structs/IntermediateDataOperation.ts";

// Typed exports.
import type { DataChangeCallback, DataRecordPromise } from "./managers/DataStorageManager.ts";
import type { ChangedRoomProperties } from "./managers/RoomManager.ts";
import type { ConnectionArguments } from "./types/ConnectionArguments.ts";
import type { APEventSubscriber, APEventUnsubscribe } from "./utils.ts";

export type {
    APEventSubscriber,
    APEventUnsubscribe,
    ChangedRoomProperties,
    ConnectionArguments,
    DataChangeCallback,
    DataRecordPromise,
};

// Default export can be the client as that will be the majority of the usage.
import { ArchipelagoClient } from "./structs/ArchipelagoClient.ts";

export default ArchipelagoClient;
