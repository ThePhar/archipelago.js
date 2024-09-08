import { ClientPacketType } from "../enums/CommandPacketTypes.ts";

/**
 * Basic chat-type packet which sends text to the server to be distributed to other clients.
 * @internal
 * @category Client Packets
 */
export interface SayPacket {
    readonly cmd: ClientPacketType.Say

    /** Text to send to others. */
    readonly text: string
}
