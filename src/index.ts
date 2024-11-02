export * from "./client.ts";
export * from "./constants.ts";
// export * from "./events.ts";
export * from "./managers/socket.ts";
export * from "./utils.ts";

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
