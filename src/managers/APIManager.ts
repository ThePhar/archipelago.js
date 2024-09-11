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
     * @example
     * // Send a raw DeathLink bounce packet.
     * client.api.send({
     *     cmd: "Bounce",
     *     tags: ["DeathLink"],
     *     data: {
     *         time: Date.now() / 1000,
     *         source: "Phar",
     *         cause: "Phar wrote bad code again which killed everyone.",
     *     },
     * });
     *
     * // Send a sync packet.
     * client.api.send({ cmd: "Sync" });
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
     * @example
     * client.api.subscribe("onBounced", (packet) => {
     *     console.log("Received a Bounced packet!", packet);
     * });
     */
    public subscribe(type: "onBounced", callback: (packet: BouncedPacket) => void): APEventUnsubscribe;

    /**
     * Subscribe to incoming {@link ConnectedPacket} packet events.
     * @param type The type of event to listen for.
     * @param callback The callback to run when this event occurs.
     * @returns An unsubscribe function to remove event listener. Event listeners are not automatically unsubscribed on
     * a disconnection event.
     * @example
     * client.api.subscribe("onConnected", (packet) => {
     *     console.log("Received a Connected packet!", packet);
     * });
     */
    public subscribe(type: "onConnected", callback: (packet: ConnectedPacket) => void): APEventUnsubscribe;

    /**
     * Subscribe to incoming {@link ConnectionRefusedPacket} packet events.
     * @param type The type of event to listen for.
     * @param callback The callback to run when this event occurs.
     * @returns An unsubscribe function to remove event listener. Event listeners are not automatically unsubscribed on
     * a disconnection event.
     * @example
     * client.api.subscribe("onConnectionRefused", (packet) => {
     *     console.log("Received a ConnectionRefused packet!", packet);
     * });
     */
    public subscribe(type: "onConnectionRefused", callback: (packet: ConnectionRefusedPacket) => void): APEventUnsubscribe;

    /**
     * Subscribe to incoming {@link DataPackagePacket} packet events.
     * @param type The type of event to listen for.
     * @param callback The callback to run when this event occurs.
     * @returns An unsubscribe function to remove event listener. Event listeners are not automatically unsubscribed on
     * a disconnection event.
     * @example
     * client.api.subscribe("onDataPackage", (packet) => {
     *     console.log("Received a DataPackage packet!", packet);
     * });
     */
    public subscribe(type: "onDataPackage", callback: (packet: DataPackagePacket) => void): APEventUnsubscribe;

    /**
     * Subscribe to incoming {@link InvalidPacketPacket} packet events.
     * @param type The type of event to listen for.
     * @param callback The callback to run when this event occurs.
     * @returns An unsubscribe function to remove event listener. Event listeners are not automatically unsubscribed on
     * a disconnection event.
     * @example
     * client.api.subscribe("onInvalidPacket", (packet) => {
     *     console.log("Received a InvalidPacket packet!", packet);
     * });
     */
    public subscribe(type: "onInvalidPacket", callback: (packet: InvalidPacketPacket) => void): APEventUnsubscribe;

    /**
     * Subscribe to incoming {@link LocationInfoPacket} packet events.
     * @param type The type of event to listen for.
     * @param callback The callback to run when this event occurs.
     * @returns An unsubscribe function to remove event listener. Event listeners are not automatically unsubscribed on
     * a disconnection event.
     * @example
     * client.api.subscribe("onLocationInfo", (packet) => {
     *     console.log("Received a LocationInfo packet!", packet);
     * });
     */
    public subscribe(type: "onLocationInfo", callback: (packet: LocationInfoPacket) => void): APEventUnsubscribe;

    /**
     * Subscribe to incoming {@link PrintJSONPacket} packet events.
     * @param type The type of event to listen for.
     * @param callback The callback to run when this event occurs.
     * @returns An unsubscribe function to remove event listener. Event listeners are not automatically unsubscribed on
     * a disconnection event.
     * @example
     * client.api.subscribe("onPrintJSON", (packet) => {
     *     console.log("Received a PrintJSON packet!", packet);
     * });
     */
    public subscribe(type: "onPrintJSON", callback: (packet: PrintJSONPacket) => void): APEventUnsubscribe;

    /**
     * Subscribe to incoming {@link ReceivedItemsPacket} packet events.
     * @param type The type of event to listen for.
     * @param callback The callback to run when this event occurs.
     * @returns An unsubscribe function to remove event listener. Event listeners are not automatically unsubscribed on
     * a disconnection event.
     * @example
     * client.api.subscribe("onReceivedItems", (packet) => {
     *     console.log("Received a ReceivedItems packet!", packet);
     * });
     */
    public subscribe(type: "onReceivedItems", callback: (packet: ReceivedItemsPacket) => void): APEventUnsubscribe;

    /**
     * Subscribe to incoming {@link RetrievedPacket} packet events.
     * @param type The type of event to listen for.
     * @param callback The callback to run when this event occurs.
     * @returns An unsubscribe function to remove event listener. Event listeners are not automatically unsubscribed on
     * a disconnection event.
     * @example
     * client.api.subscribe("onRetrieved", (packet) => {
     *     console.log("Received a Retrieved packet!", packet);
     * });
     */
    public subscribe(type: "onRetrieved", callback: (packet: RetrievedPacket) => void): APEventUnsubscribe;

    /**
     * Subscribe to incoming {@link RoomInfoPacket} packet events.
     * @param type The type of event to listen for.
     * @param callback The callback to run when this event occurs.
     * @returns An unsubscribe function to remove event listener. Event listeners are not automatically unsubscribed on
     * a disconnection event.
     * @example
     * client.api.subscribe("onRoomInfo", (packet) => {
     *     console.log("Received a RoomInfo packet!", packet);
     * });
     */
    public subscribe(type: "onRoomInfo", callback: (packet: RoomInfoPacket) => void): APEventUnsubscribe;

    /**
     * Subscribe to incoming {@link RoomUpdatePacket} packet events.
     * @param type The type of event to listen for.
     * @param callback The callback to run when this event occurs.
     * @returns An unsubscribe function to remove event listener. Event listeners are not automatically unsubscribed on
     * a disconnection event.
     * @example
     * client.api.subscribe("onRoomUpdate", (packet) => {
     *     console.log("Received a RoomUpdate packet!", packet);
     * });
     */
    public subscribe(type: "onRoomUpdate", callback: (packet: RoomUpdatePacket) => void): APEventUnsubscribe;

    /**
     * Subscribe to incoming {@link SetReplyPacket} packet events.
     * @param type The type of event to listen for.
     * @param callback The callback to run when this event occurs.
     * @returns An unsubscribe function to remove event listener. Event listeners are not automatically unsubscribed on
     * a disconnection event.
     * @example
     * client.api.subscribe("onSetReply", (packet) => {
     *     console.log("Received a SetReply packet!", packet);
     * });
     */
    public subscribe(type: "onSetReply", callback: (packet: SetReplyPacket) => void): APEventUnsubscribe;

    /**
     * Subscribe to any incoming network protocol packet events.
     * @param type The type of event to listen for.
     * @param callback The callback to run when this event occurs.
     * @returns An unsubscribe function to remove event listener. Event listeners are not automatically unsubscribed on
     * a disconnection event.
     * @example
     * client.api.subscribe("onPacketReceived", (packet) => {
     *     console.log(`Received a ${packet.cmd} packet!`, packet);
     * });
     */
    public subscribe(type: "onPacketReceived", callback: (packet: ServerPacket) => void): APEventUnsubscribe;

    /**
     * Subscribe to socket disconnection events.
     * @param type The type of event to listen for.
     * @param callback The callback to run when this event occurs.
     * @returns An unsubscribe function to remove event listener. Event listeners are not automatically unsubscribed on
     * a disconnection event.
     * @example
     * client.api.subscribe("onDisconnected", () => {
     *     console.log("Lost connection to the server.");
     * });
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
