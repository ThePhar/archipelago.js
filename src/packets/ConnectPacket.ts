import { ItemsHandlingFlags } from "../consts/ItemsHandlingFlags";
import { NetworkVersion } from "../types/NetworkVersion";
import { BaseClientPacket } from "./BasePackets";

/**
 * Sent by the client to initiate a connection to an Archipelago game session. Sent automatically during
 * {@link Client.connect}.
 *
 * @category Client Packets
 */
export interface ConnectPacket extends BaseClientPacket {
    cmd: "Connect";

    /** If the game session requires a password, it should be passed here. */
    password: string;

    /** The name of the game the client is playing. */
    game: string;

    /** The slot name for this client. */
    name: string;

    /** Unique identifier for player client. */
    uuid: string;

    /** Denotes special features or capabilities that the sender is currently capable of. */
    tags: string[];

    /** If true, the Connect answer will contain slot_data */
    slot_data: boolean;

    /** An object representing the minimum Archipelago server version this client supports. */
    version: NetworkVersion;

    /**
     * Bit flags configuring which items should be sent by the server. Read {@link ItemsHandlingFlags} for information
     * on individual flags.
     */
    items_handling: number | ItemsHandlingFlags;
}
