import { NetworkVersion } from "../../types/NetworkVersion.ts";

/**
 * Sent by the client to initiate a connection to an Archipelago game session.
 * @category Client Packets
 */
export type ConnectPacket = {
    readonly cmd: "Connect"

    /** If the game session requires a password, it should be passed here. */
    readonly password: string

    /** The name of the game the client is playing. */
    readonly game: string

    /** The slot name for this client. */
    readonly name: string

    /** Unique identifier for player client. */
    readonly uuid: string

    /** Denotes special features or capabilities that the sender is currently capable of. */
    readonly tags: string[]

    /** An object representing the minimum Archipelago server version this client supports. */
    readonly version: NetworkVersion

    /**
     * Bit flags configuring which items should be sent by the server. Read {@link ItemsHandlingFlags} for information
     * on individual flags.
     */
    readonly items_handling: number

    /** If `true`, the {@link ConnectedPacket} will contain slot data. */
    readonly slot_data: boolean
}
