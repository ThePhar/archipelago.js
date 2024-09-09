/**
 * Update arguments from the Connect packet, currently only updating `tags` and `items_handling` is supported.
 * @category Client Packets
 */
export type ConnectUpdatePacket = {
    readonly cmd: "ConnectUpdate"

    /**
     * Bit flags configuring which items should be sent by the server. See {@link ItemsHandlingFlags} for additional
     * information.
     */
    readonly items_handling: number

    /** Denotes special features or capabilities that the sender is currently capable of. */
    readonly tags: string[]
};
