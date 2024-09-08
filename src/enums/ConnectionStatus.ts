/**
 * A const of the current connection status to the Archipelago server.
 */
export const enum ConnectionStatus {
    /** Currently not connected to any Archipelago server. */
    Disconnected = "Disconnected",

    /** Connected to the Archipelago server, but awaiting to authenticate to join the room. */
    Unauthenticated = "Unauthenticated",

    /** Connected to the Archipelago server and authenticated to the current room. */
    Connected = "Connected",
}
