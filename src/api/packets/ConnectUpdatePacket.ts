import { ClientPacketType } from "../enums/CommandPacketTypes";

/**
 * Update arguments from the Connect packet, currently only updating `tags` and `items_handling` is supported.
 * @internal
 * @category Client Packets
 */
export interface ConnectUpdatePacket {
    readonly cmd: ClientPacketType.ConnectUpdate

    /**
     * Bit flags configuring which items should be sent by the server. See {@link ItemsHandlingFlags} for additional
     * information.
     */
    readonly items_handling: number

    /** Denotes special features or capabilities that the sender is currently capable of. */
    readonly tags: string[]
}
