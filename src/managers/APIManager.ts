import {
    BouncedPacket,
    ClientPacket,
    ConnectedPacket,
    ConnectionRefusedPacket,
    DataPackagePacket,
    InvalidPacketPacket,
    LocationInfoPacket,
    PrintJSONPacket,
    ReceivedItemsPacket,
    RetrievedPacket,
    RoomInfoPacket,
    RoomUpdatePacket,
    ServerPacket,
    SetReplyPacket,
} from "../api/packets";
import { APEventUnsubscribe, createSubscriber } from "../utils.ts";

/**
 * Manages network API-level events and exposes helper methods to faciliate that communication.
 * @category Manager Class
 */
export class APIManager {
    readonly #send: (packets: ClientPacket[]) => void;
    readonly #events: EventTarget;

    /**
     * Instantiates a new APIManager.
     * @internal
     * @param events The EventTarget attached to the Archipelago client.
     * @param send The Archipelago client associated with this manager.
     */
    public constructor(events: EventTarget, send: (packets: ClientPacket[]) => void) {
        this.#send = send;
        this.#events = events;

        // Process packets.
        createSubscriber<ServerPacket[]>(this.#events, "__onPacketsReceived")(this.#onPacketsReceived.bind(this));
    }

    /**
     * Send client packet(s) to the server.
     * @param packets A list of packets to send, to be processed in order defined.
     * @throws {@link ArchipelagoErrors.APSocketError} if not connected to an Archipelago server.
     */
    public send(...packets: ClientPacket[]): void {
        // Use the ArchipelagoClient's send function, so it can maintain control over the socket.
        this.#send(packets);
    }

    /**
     * Subscribe to incoming {@link BouncedPacket} packet events.
     * @param type The type of event to listen for.
     * @param callback The callback to run when this event occurs.
     * @returns An unsubscribe function to remove event listener. Event listeners are not automatically unsubscribed on
     * a disconnection event.
     */
    public subscribe(type: "onBounced", callback: (packet: BouncedPacket) => void): APEventUnsubscribe;

    /**
     * Subscribe to incoming {@link ConnectedPacket} packet events.
     * @param type The type of event to listen for.
     * @param callback The callback to run when this event occurs.
     * @returns An unsubscribe function to remove event listener. Event listeners are not automatically unsubscribed on
     * a disconnection event.
     */
    public subscribe(type: "onConnected", callback: (packet: ConnectedPacket) => void): APEventUnsubscribe;

    /**
     * Subscribe to incoming {@link ConnectionRefusedPacket} packet events.
     * @param type The type of event to listen for.
     * @param callback The callback to run when this event occurs.
     * @returns An unsubscribe function to remove event listener. Event listeners are not automatically unsubscribed on
     * a disconnection event.
     */
    public subscribe(type: "onConnectionRefused", callback: (packet: ConnectionRefusedPacket) => void): APEventUnsubscribe;

    /**
     * Subscribe to incoming {@link DataPackagePacket} packet events.
     * @param type The type of event to listen for.
     * @param callback The callback to run when this event occurs.
     * @returns An unsubscribe function to remove event listener. Event listeners are not automatically unsubscribed on
     * a disconnection event.
     */
    public subscribe(type: "onDataPackage", callback: (packet: DataPackagePacket) => void): APEventUnsubscribe;

    /**
     * Subscribe to incoming {@link InvalidPacketPacket} packet events.
     * @param type The type of event to listen for.
     * @param callback The callback to run when this event occurs.
     * @returns An unsubscribe function to remove event listener. Event listeners are not automatically unsubscribed on
     * a disconnection event.
     */
    public subscribe(type: "onInvalidPacket", callback: (packet: InvalidPacketPacket) => void): APEventUnsubscribe;

    /**
     * Subscribe to incoming {@link LocationInfoPacket} packet events.
     * @param type The type of event to listen for.
     * @param callback The callback to run when this event occurs.
     * @returns An unsubscribe function to remove event listener. Event listeners are not automatically unsubscribed on
     * a disconnection event.
     */
    public subscribe(type: "onLocationInfo", callback: (packet: LocationInfoPacket) => void): APEventUnsubscribe;

    /**
     * Subscribe to incoming {@link PrintJSONPacket} packet events.
     * @param type The type of event to listen for.
     * @param callback The callback to run when this event occurs.
     * @returns An unsubscribe function to remove event listener. Event listeners are not automatically unsubscribed on
     * a disconnection event.
     */
    public subscribe(type: "onPrintJSON", callback: (packet: PrintJSONPacket) => void): APEventUnsubscribe;

    /**
     * Subscribe to incoming {@link ReceivedItemsPacket} packet events.
     * @param type The type of event to listen for.
     * @param callback The callback to run when this event occurs.
     * @returns An unsubscribe function to remove event listener. Event listeners are not automatically unsubscribed on
     * a disconnection event.
     */
    public subscribe(type: "onReceivedItems", callback: (packet: ReceivedItemsPacket) => void): APEventUnsubscribe;

    /**
     * Subscribe to incoming {@link RetrievedPacket} packet events.
     * @param type The type of event to listen for.
     * @param callback The callback to run when this event occurs.
     * @returns An unsubscribe function to remove event listener. Event listeners are not automatically unsubscribed on
     * a disconnection event.
     */
    public subscribe(type: "onRetrieved", callback: (packet: RetrievedPacket) => void): APEventUnsubscribe;

    /**
     * Subscribe to incoming {@link RoomInfoPacket} packet events.
     * @param type The type of event to listen for.
     * @param callback The callback to run when this event occurs.
     * @returns An unsubscribe function to remove event listener. Event listeners are not automatically unsubscribed on
     * a disconnection event.
     */
    public subscribe(type: "onRoomInfo", callback: (packet: RoomInfoPacket) => void): APEventUnsubscribe;

    /**
     * Subscribe to incoming {@link RoomUpdatePacket} packet events.
     * @param type The type of event to listen for.
     * @param callback The callback to run when this event occurs.
     * @returns An unsubscribe function to remove event listener. Event listeners are not automatically unsubscribed on
     * a disconnection event.
     */
    public subscribe(type: "onRoomUpdate", callback: (packet: RoomUpdatePacket) => void): APEventUnsubscribe;

    /**
     * Subscribe to incoming {@link SetReplyPacket} packet events.
     * @param type The type of event to listen for.
     * @param callback The callback to run when this event occurs.
     * @returns An unsubscribe function to remove event listener. Event listeners are not automatically unsubscribed on
     * a disconnection event.
     */
    public subscribe(type: "onSetReply", callback: (packet: SetReplyPacket) => void): APEventUnsubscribe;

    /**
     * Subscribe to any incoming network protocol packet events.
     * @param type The type of event to listen for.
     * @param callback The callback to run when this event occurs.
     * @returns An unsubscribe function to remove event listener. Event listeners are not automatically unsubscribed on
     * a disconnection event.
     */
    public subscribe(type: "onPacketReceived", callback: (packet: ServerPacket) => void): APEventUnsubscribe;

    /**
     * Subscribe to socket disconnection events.
     * @param type The type of event to listen for.
     * @param callback The callback to run when this event occurs.
     * @returns An unsubscribe function to remove event listener. Event listeners are not automatically unsubscribed on
     * a disconnection event.
     */
    public subscribe(type: "onDisconnected", callback: () => void): APEventUnsubscribe;

    public subscribe(type: SubscriptionEventType, callback: (packet: never) => void): APEventUnsubscribe {
        const subscribe = createSubscriber<ServerPacket>(this.#events, type);
        return subscribe(callback as (packet: ServerPacket) => void);
    }

    #onPacketsReceived(packets: ServerPacket[]): void {
        for (const packet of packets) {
            this.#dispatch(`on${packet.cmd}`, packet);
            this.#dispatch("onPacketReceived", packet);
        }
    }

    #dispatch(type: SubscriptionEventType, packet: ServerPacket): void {
        this.#events.dispatchEvent(new CustomEvent<ServerPacket>(type, { detail: packet }));
    }
}

type SubscriptionEventType =
    | "onBounced"
    | "onConnected"
    | "onConnectionRefused"
    | "onDataPackage"
    | "onInvalidPacket"
    | "onLocationInfo"
    | "onPrintJSON"
    | "onReceivedItems"
    | "onRetrieved"
    | "onRoomInfo"
    | "onRoomUpdate"
    | "onSetReply"
    | "onPacketReceived"
    | "onDisconnected";
