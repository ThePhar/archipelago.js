// /**
//  * A collection of types, constants, and enumerations that get passed over the Archipelago network protocol.
//  *
//  * You can read more information about the Network Protocol in the Archipelago
//  * [Network Protocol](https://github.com/ArchipelagoMW/Archipelago/blob/main/docs/network%20protocol.md)
//  * documentation on their GitHub repository.
//  * @namespace
//  * @remarks Library subscribers should utilize built-in helper methods and objects, if available, but these base types
//  * are still exposed for advanced users.
//  */
// export * as NetworkProtocol from "./api";
//
// /**
//  * A collection of custom Error classes that may be thrown during abnormal events.
//  * @namespace
//  */
// export * as ArchipelagoErrors from "./errors.ts";
//
// // Normal exports.
// export { Client } from "./client.ts";
// export { APIManager } from "./managers/APIManager.ts";
// export { DataPackageManager, PackageMetadata } from "./managers/DataPackageManager.ts";
// export { DataStorageManager } from "./managers/DataStorageManager.ts";
// export { PlayerMetadata, PlayersManager } from "./managers/PlayersManager.ts";
// export { IntermediateDataOperation } from "./structs/IntermediateDataOperation.ts";
//
// // Typed exports.
// import type { DataChangeCallback, DataRecordPromise } from "./managers/DataStorageManager.ts";
// import type { ConnectionArguments } from "./types/ConnectionArguments.ts";
// import type { APEventSubscriber, APEventUnsubscribe } from "./utils.ts";
//
// export type {
//     APEventSubscriber,
//     APEventUnsubscribe,
//     ChangedRoomProperties,
//     ConnectionArguments,
//     DataChangeCallback,
//     DataRecordPromise,
// };
//
// // Default export can be the client as that will be the majority of the usage.
// import { Client } from "./client.ts";
//
// export default Client;

export { Client } from "./client.ts";
export { SocketEvents, SocketManager } from "./managers/socket.ts";

/**
 * A collection of types, constants, and enumerations that get passed over the Archipelago network protocol.
 *
 * You can read more information about the Network Protocol in the Archipelago
 * [Network Protocol](https://github.com/ArchipelagoMW/Archipelago/blob/main/docs/network%20protocol.md)
 * documentation on their GitHub repository.
 * @namespace API
 * @remarks Users of this library should utilize built-in helper methods and objects, whenever available, but these
 * base types are still exposed, if needed.
 */
export * as API from "./api";
