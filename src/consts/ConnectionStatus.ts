import { ObjectValues } from "../types/ObjectValues.ts";

/**
 * A const of the current {@link Client} connection status to the Archipelago server.
 */
export const CONNECTION_STATUS = {
    /** Currently not connected to any Archipelago server. */
    DISCONNECTED: "Disconnected",

    /** Attempting to establish a connection to the Archipelago server. */
    CONNECTING: "Connecting",

    /** Connected to the Archipelago server, but awaiting to authenticate to join the room. */
    WAITING_FOR_AUTH: "Waiting For Authentication",

    /** Connected to the Archipelago server and authenticated to the current room. */
    CONNECTED: "Connected",
} as const;

export type ConnectionStatus = ObjectValues<typeof CONNECTION_STATUS>;
