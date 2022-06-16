import { ItemsHandlingFlags } from "@enums";

/** An object that holds credential information for a slot. */
export interface SlotCredentials {
    /** The name of the game the client is playing. Example: `A Link to the Past` */
    game: string;

    /** Unique identifier for player client. */
    uuid: string;

    /** The slot/player name for this client. */
    name: string;

    /** If the game session requires a password, it should be passed here. */
    password?: string;

    /** An object representing the minimum Archipelago server version this client supports. */
    version: {
        major: number;
        minor: number;
        build: number;
    };

    /** Denotes special features or capabilities that the sender is currently capable of. */
    tags?: string[];

    /**
     * Bit flags configuring which items should be sent by the server. Read {@link ItemsHandlingFlags} for information
     * on individual flags.
     */
    items_handling: number | ItemsHandlingFlags;
}
