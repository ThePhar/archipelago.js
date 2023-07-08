import { ItemsHandlingFlags } from "./ItemsHandlingFlags.ts";

/** An object that holds credential information for a slot to connect. */
export interface ConnectionInformation {
    /** The hostname or ip address of the Archipelago server to connect to. */
    hostname: string;

    /** The port of the Archipelago server to connect to. */
    port: number;

    /** The name of the game the client is playing. */
    game: string;

    /** The slot/player name for this client. */
    name: string;

    /** Unique identifier for player client. If not specified, {@link Client} will generate one automatically. */
    uuid?: string;

    /** If the game session requires a password, it should be passed here. */
    password?: string;

    /**
     * Whether to explicitly use insecure websockets or secure websockets. If `undefined`, will attempt secure
     * websockets first, and fallback to insecure websockets if it fails to connect.
     */
    protocol?: "ws" | "wss";

    /**
     * Bit flags configuring which items should be sent by the server. Read {@link ItemsHandlingFlags} for information
     * on individual flags.
     */
    items_handling: number | ItemsHandlingFlags;

    /**
     * An object representing the minimum Archipelago server version this client supports. If not specified,
     * {@link Client} will send the minimum supported version by this library.
     */
    version?: {
        major: number;
        minor: number;
        build: number;
    };

    /** Denotes special features or capabilities that the sender is currently capable of. */
    tags?: string[];
}
