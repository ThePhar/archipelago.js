import { ItemsHandlingFlags } from "../consts/ItemsHandlingFlags";
import { BaseClientPacket } from "./BasePackets";

/**
 * Update arguments from the Connect packet, currently only updating `tags` and `items_handling` is supported.
 *
 * @category Client Packets
 */
export interface ConnectUpdatePacket extends BaseClientPacket {
    cmd: "ConnectUpdate";

    /**
     * Bit flags configuring which items should be sent by the server. See {@link ItemsHandlingFlags} for additional
     * information.
     */
    items_handling: number | ItemsHandlingFlags;

    /** Denotes special features or capabilities that the sender is currently capable of. */
    tags: string[];
}
