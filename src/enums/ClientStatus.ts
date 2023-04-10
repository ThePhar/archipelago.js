/**
 *  An enumeration containing the possible client states that may be used to inform the server in
 * {@link StatusUpdatePacket}.
 */
export const enum ClientStatus {
    /** Client is in an unknown state. */
    UNKNOWN = 0,

    /** Client is currently connected. */
    CONNECTED = 5,

    /** Client is current ready to start. */
    READY = 10,

    /** Client is currently playing. */
    PLAYING = 20,

    /** Client has completed their goal. */
    GOAL = 30,
}
