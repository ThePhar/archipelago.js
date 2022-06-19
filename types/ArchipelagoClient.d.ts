import * as Packet from "./packets";
import { SessionStatus } from "./enums";
import { DataManager, ItemsManager, LocationsManager, PlayersManager } from "./managers";
import { SlotCredentials } from "./structs";
/**
 * The client that connects to an Archipelago server and facilitates communication, listens for events, and
 * manages data.
 */
export declare class ArchipelagoClient {
    private readonly _uri;
    private _socket?;
    private _status;
    private _emitter;
    private _dataManager;
    private _itemsManager;
    private _locationsManager;
    private _playersManager;
    /**
     * Creates a new client that is programmed to connect to a specific Archipelago server address.
     *
     * @param socketAddress - The socket address to connect to. Examples: `127.0.0.1:50000` or `archipelago.gg:38281`.
     */
    constructor(socketAddress: string);
    /**
     * Get the current WebSocket connection status to the Archipelago server.
     */
    get status(): SessionStatus;
    /**
     * Get the {@link DataManager} helper object. See {@link DataManager} for additional information.
     */
    get data(): DataManager;
    /**
     * Get the {@link ItemsManager} helper object. See {@link ItemsManager} for additional information.
     */
    get items(): ItemsManager;
    /**
     * Get the {@link LocationsManager} helper object. See {@link LocationsManager} for additional information.
     */
    get locations(): LocationsManager;
    /**
     * Get the {@link PlayersManager} helper object. See {@link PlayersManager} for additional information.
     */
    get players(): PlayersManager;
    /**
     * Connects to the given address with given connection information.
     *
     * @param credentials - An object with all the credential information to connect to the slot.
     * @resolves On successful connection and authentication to the room.
     * @rejects If web socket connection failed to establish connection or server refused connection, promise will
     * return a `string[]` of error messages.
     */
    connect(credentials: SlotCredentials): Promise<void>;
    /**
     * Send a list of raw packets to the Archipelago server in the order they are listed as arguments.
     *
     * @param packets An array of raw {@link ArchipelagoClientPacket}s to send to the AP server. They are
     *   processed in the order they are listed as arguments.
     */
    send(...packets: Packet.ArchipelagoClientPacket[]): void;
    /**
     * Disconnect from the server and re-initialize all managers.
     */
    disconnect(): void;
    addListener(event: "bounced", listener: (packet: Packet.BouncedPacket) => void): void;
    addListener(event: "connected", listener: (packet: Packet.ConnectedPacket) => void): void;
    addListener(event: "connectionRefused", listener: (packet: Packet.ConnectionRefusedPacket) => void): void;
    addListener(event: "dataPackage", listener: (packet: Packet.DataPackagePacket) => void): void;
    addListener(event: "invalidPacket", listener: (packet: Packet.InvalidPacketPacket) => void): void;
    addListener(event: "locationInfo", listener: (packet: Packet.LocationInfoPacket) => void): void;
    addListener(event: "printJSON", listener: (packet: Packet.PrintJSONPacket) => void): void;
    addListener(event: "print", listener: (packet: Packet.PrintPacket) => void): void;
    addListener(event: "receivedItems", listener: (packet: Packet.ReceivedItemsPacket) => void): void;
    addListener(event: "retrieved", listener: (packet: Packet.RetrievedPacket) => void): void;
    addListener(event: "roomInfo", listener: (packet: Packet.RoomInfoPacket) => void): void;
    addListener(event: "roomUpdate", listener: (packet: Packet.RoomUpdatePacket) => void): void;
    addListener(event: "setReply", listener: (packet: Packet.SetReplyPacket) => void): void;
    addListener(event: "packetReceived", listener: (packet: Packet.ArchipelagoServerPacket) => void): void;
    removeListener(event: "bounced", listener: (packet: Packet.BouncedPacket) => void): void;
    removeListener(event: "connected", listener: (packet: Packet.ConnectedPacket) => void): void;
    removeListener(event: "connectionRefused", listener: (packet: Packet.ConnectionRefusedPacket) => void): void;
    removeListener(event: "dataPackage", listener: (packet: Packet.DataPackagePacket) => void): void;
    removeListener(event: "invalidPacket", listener: (packet: Packet.InvalidPacketPacket) => void): void;
    removeListener(event: "locationInfo", listener: (packet: Packet.LocationInfoPacket) => void): void;
    removeListener(event: "printJSON", listener: (packet: Packet.PrintJSONPacket) => void): void;
    removeListener(event: "print", listener: (packet: Packet.PrintPacket) => void): void;
    removeListener(event: "receivedItems", listener: (packet: Packet.ReceivedItemsPacket) => void): void;
    removeListener(event: "retrieved", listener: (packet: Packet.RetrievedPacket) => void): void;
    removeListener(event: "roomInfo", listener: (packet: Packet.RoomInfoPacket) => void): void;
    removeListener(event: "roomUpdate", listener: (packet: Packet.RoomUpdatePacket) => void): void;
    removeListener(event: "setReply", listener: (packet: Packet.SetReplyPacket) => void): void;
    removeListener(event: "packetReceived", listener: (packet: Packet.ArchipelagoServerPacket) => void): void;
    private parsePackets;
}
/**
 * A type union of events the {@link ArchipelagoClient} can allow subscriptions for.
 */
export declare type ClientEvents = "packetReceived" | "bounced" | "connected" | "connectionRefused" | "dataPackage" | "invalidPacket" | "locationInfo" | "printJSON" | "print" | "receivedItems" | "retrieved" | "roomInfo" | "roomUpdate" | "setReply";
//# sourceMappingURL=ArchipelagoClient.d.ts.map