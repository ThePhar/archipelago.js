/**
 * A const of the current connection status to the Archipelago server.
 */
export const enum CONNECTION_STATUS {
    /** Currently not connected to any Archipelago server. */
    Disconnected = "Disconnected",

    /** Attempting to establish a connection to the Archipelago server. */
    Connecting = "Connecting",

    /** Connected to the Archipelago server, but awaiting to authenticate to join the room. */
    Unauthenticated = "Unauthenticated",

    /** Connected to the Archipelago server and authenticated to the current room. */
    Connected = "Connected",
}
