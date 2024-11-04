import { ItemsHandlingFlags } from "../consts/ItemsHandlingFlags";

/**
 * An object that holds credential information for a slot to connect.
 */
export type ConnectionInformation = {
    /** The hostname or ip address of the Archipelago server to connect to. */
    hostname: string;

    /** The port of the Archipelago server to connect to. */
    port: number;

    /**
     * Whether to explicitly use insecure websockets or secure websockets. If `undefined`, client will attempt secure
     * websockets first, then fallback to insecure websockets if it fails to connect.
     */
    protocol?: "ws" | "wss";

    /** The slot/player name for this client. */
    name: string;

    /** The name of the game the client is playing. */
    game: string;

    /** If the game session requires a password, it should be passed here. */
    password?: string;

    /**
     * An object representing the minimum Archipelago server version this client supports. If not specified,
     * {@link Client} will send the minimum supported version by this library.
     */
    version?: {
        major: number;
        minor: number;
        build: number;
    };

    /** Unique identifier for player client. If not specified, the client will generate one automatically. */
    uuid?: string;

    /** Denotes special features or capabilities that the sender is currently capable of. */
    tags?: string[];

    /** If true, the Connect answer will contain slot_data */
    slot_data?: boolean;

    /**
     * Bit flags configuring which items should be sent by the server. Read {@link ItemsHandlingFlags} for information
     * on individual flags.
     */
    items_handling: number | ItemsHandlingFlags;
};
