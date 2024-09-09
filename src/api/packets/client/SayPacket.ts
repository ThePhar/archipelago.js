/**
 * Basic chat-type packet which sends text to the server to be distributed to other clients.
 * @category Client Packets
 */
export type SayPacket = {
    readonly cmd: "Say"

    /** Text to send to others. */
    readonly text: string
}
