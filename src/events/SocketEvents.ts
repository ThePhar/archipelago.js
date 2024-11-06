import {
    BouncedPacket,
    ClientPacket,
    ConnectedPacket,
    ConnectionRefusedPacket,
    DataPackagePacket,
    InvalidPacketPacket,
    JSONRecord,
    LocationInfoPacket,
    PrintJSONPacket,
    ReceivedItemsPacket,
    RetrievedPacket,
    RoomInfoPacket,
    RoomUpdatePacket,
    ServerPacket,
    SetReplyPacket,
} from "../api";

/**
 * An interface with all supported socket events and their respective callback arguments. To be called from
 * {@link SocketManager}.
 * @example
 * // Print all chat messages to the console when received.
 * client.socket.on("PrintJSON", (packet, message) => {
 *     console.log(message);
 * });
 *
 * // Warn when lost connection.
 * client.socket.on("Disconnect", () => {
 *     console.warn("Lost connection to the server!");
 * }
 */
export type SocketEvents = {
    /**
     * Fires when the client receives a {@link BouncedPacket}.
     * @param packet The raw {@link BouncedPacket}.
     */
    bounced: [packet: BouncedPacket, data: JSONRecord]

    /**
     * Fires when the client receives a {@link ConnectedPacket}
     * @param packet The raw {@link ConnectedPacket} packet.
     * @remarks This also means the client has authenticated to an Archipelago server.
     */
    connected: [packet: ConnectedPacket]

    /**
     * Fires when the client receives a {@link ConnectionRefusedPacket}.
     * @param packet The raw {@link ConnectionRefusedPacket}.
     */
    connectionRefused: [packet: ConnectionRefusedPacket]

    /**
     * Fires when the client receives a {@link DataPackagePacket}.
     * @param packet The raw {@link DataPackagePacket}.
     */
    dataPackage: [packet: DataPackagePacket]

    /**
     * Fires when the client receives a {@link InvalidPacketPacket}.
     * @param packet The raw {@link InvalidPacketPacket}.
     */
    invalidPacket: [packet: InvalidPacketPacket]

    /**
     * Fires when the client receives a {@link LocationInfoPacket}.
     * @param packet The raw {@link LocationInfoPacket}.
     */
    locationInfo: [packet: LocationInfoPacket]

    /**
     * Fires when the client receives a {@link PrintJSONPacket}.
     * @param packet The raw {@link PrintJSONPacket} packet.
     * @param message The full plaintext message content.
     */
    printJSON: [packet: PrintJSONPacket]

    /**
     * Fires when the client receives a {@link ReceivedItemsPacket}.
     * @param packet The raw {@link ReceivedItemsPacket}.
     */
    receivedItems: [packet: ReceivedItemsPacket]

    /**
     * Fires when the client receives a {@link RetrievedPacket}.
     * @param packet The raw {@link RetrievedPacket}.
     */
    retrieved: [packet: RetrievedPacket]

    /**
     * Fires when the client receives a {@link RoomInfoPacket}.
     * @param packet The raw {@link RoomInfoPacket}.
     * @remarks This also means the client has established a websocket connection to an Archipelago server, but not yet
     * authenticated.
     */
    roomInfo: [packet: RoomInfoPacket]

    /**
     * Fires when the client receives a {@link RoomUpdatePacket}.
     * @param packet The raw {@link RoomUpdatePacket}.
     */
    roomUpdate: [packet: RoomUpdatePacket]

    /**
     * Fires when the client receives a {@link SetReplyPacket}.
     * @param packet The raw {@link SetReplyPacket}.
     */
    setReply: [packet: SetReplyPacket]

    /**
     * Fires when the client receives any {@link ServerPacket}.
     * @param packet Any received {@link ServerPacket}. Additional checks on the `cmd` property will be required to
     * determine the type of packet received.
     * @remarks All specific packet event listeners will fire before this event fires.
     */
    receivedPacket: [packet: ServerPacket]

    /**
     * Fires when the client sends an array of {@link ClientPacket}.
     * @param packets An array of {@link ClientPacket} sent to the server.
     */
    sentPackets: [packets: ClientPacket[]]

    /**
     * Fires when the client has lost connection to the server, intentionally or not.
     */
    disconnected: []
};
