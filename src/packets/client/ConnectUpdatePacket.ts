import { CommandPacketType } from "@enums";
import { BasePacket } from "@packets";

/**
 * Update arguments from the Connect packet, currently only updating `tags` and `items_handling` is supported.
 *
 * @category Client Packets
 */
export interface ConnectUpdatePacket extends BasePacket {
    cmd: CommandPacketType.CONNECT_UPDATE;

    /**
     * Bit flags configuring which items should be sent by the server. See {@link ItemsHandlingFlags} for additional
     * information.
     */
    items_handling: number;

    /** Denotes special features or capabilities that the sender is currently capable of. */
    tags: string[];
}
