/**
 *  An enumeration containing the possible client states that may be used to inform the server during a status update.
 *  @internal
 */
export const enum ClientStatus {
    /** Client is in an unknown/disconnected state. */
    Disconnected = 0,

    /** Client is currently connected. */
    Connected = 5,

    /** Client is current ready to start. */
    Ready = 10,

    /** Client is currently playing. */
    Playing = 20,

    /** Client has completed their goal. */
    Goal = 30,
}
