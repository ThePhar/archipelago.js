import { CommandPacketType } from "../../enums";
import { NetworkVersion, SlotCredentials } from "../../structs";
import { BasePacket } from "../index";

/**
 * Sent by the client to initiate a connection to an Archipelago game session. Sent automatically during
 * {@link ArchipelagoClient.connect}.
 *
 * @category Client Packets
 */
export interface ConnectPacket extends BasePacket, SlotCredentials {
    cmd: CommandPacketType.CONNECT;

    /** If the game session requires a password, it should be passed here. */
    password: string;

    /** Denotes special features or capabilities that the sender is currently capable of. */
    tags: string[];

    /** An object representing the minimum Archipelago server version this client supports. */
    version: NetworkVersion;
}
