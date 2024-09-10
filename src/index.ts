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
export { ArchipelagoClient } from "./ArchipelagoClient.ts";
export { CommonTags } from "./consts/CommonTags.ts";
export { APIManager } from "./managers/APIManager.ts";
export { ChatManager } from "./managers/ChatManager.ts";
export { DataStorageManager } from "./managers/DataStorageManager.ts";
export { ItemsManager } from "./managers/ItemsManager.ts";
export { LocationsManager } from "./managers/LocationsManager.ts";
export { PlayersManager } from "./managers/PlayersManager.ts";
export { RoomManager } from "./managers/RoomManager.ts";

// Typed exports.
import type { ConnectionArguments } from "./types/ConnectionArguments.ts";
import type { APEventSubscriber, APEventUnsubscribe } from "./utils.ts";

export type {
    APEventSubscriber,
    APEventUnsubscribe,
    ConnectionArguments,
};

// Default export can be the client as that will be the majority of the usage.
import { ArchipelagoClient } from "./ArchipelagoClient.ts";

export default ArchipelagoClient;
