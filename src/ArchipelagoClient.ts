import { AbstractSlotData, ClientPacketType } from "./api";
import { ConnectionStatus } from "./enums/ConnectionStatus.ts";
import { RoomManager } from "./managers/RoomManager.ts";
import { SocketManager } from "./managers/SocketManager.ts";
import { APEventEmitter } from "./utils/APEventEmitter.ts";
import { PlayerInfo } from "./PlayerInfo.ts";

/**
 * The client that connects to an Archipelago server and facilitates communication, listens for events, and manages
 * data.
 * @template TSlotData If slot data is requested, the type for that slot data.
 */
export class ArchipelagoClient<TSlotData extends AbstractSlotData> {
    readonly #events: APEventEmitter = new APEventEmitter();
    readonly #game: string;
    #team: number = -1;
    #slot: number = -1;
    #hintPoints: number = 0;
    #slotData: TSlotData = {} as TSlotData;
    #missingLocations: Set<number> = new Set();
    #checkedLocations: Set<number> = new Set();

    /**
     * Manages the web socket and API-level communication.
     * @remarks Library subscribers should use the abstracted helper functions/structs instead of interacting with the
     * api or socket directly, but it is exposed if necessary.
     */
    public readonly socket: SocketManager = new SocketManager(this, this.#events);

    /**
     * Manages room data such as room settings, containing games, data packages, etc.
     */
    public readonly room: RoomManager = new RoomManager(this);

    /**
     * Creates a new Archipelago client for a specified game.
     * @param game
     */
    public constructor(game: string) {
        this.#game = game;

        // If a disconnection event happens, reset all fields.
        this.socket.subscribe("onDisconnected", () => {
            this.#initializeFields();
        });

        this.socket.subscribe("onConnected", (packet) => {
            this.#team = packet.team;
            this.#slot = packet.slot;
            this.#hintPoints = packet.hint_points;
            this.#slotData = packet.slot_data as TSlotData;
            this.#checkedLocations = new Set(packet.checked_locations);
            this.#missingLocations = new Set(packet.missing_locations);
        });

        this.socket.subscribe("onRoomUpdate", (packet) => {
            this.#hintPoints = packet.hint_points || this.#hintPoints;

            // Update locations.
            if (packet.checked_locations) {
                for (const location of packet.checked_locations) {
                    if (!this.#checkedLocations.has(location)) {
                        this.#checkedLocations.add(location);
                        this.#missingLocations.delete(location);
                    }
                }
            }
        })
    }

    /**
     * This client's current team id.
     */
    public get team(): number {
        return this.#team;
    }

    /**
     * This client's current slot id.
     */
    public get slot(): number {
        return this.#slot;
    }

    /**
     * The {@link PlayerInfo} for this client.
     */
    public get player(): PlayerInfo {
        return this.room.findPlayer(this.team, this.slot) as PlayerInfo;
    }

    /**
     * The type of game this client handles.
     */
    public get game(): string {
        return this.#game;
    }

    /**
     * This number of hint points this client's player currently has.
     */
    public get hintPoints(): number {
        return this.#hintPoints;
    }

    /**
     * The slot data, if available. Otherwise, an empty object.
     */
    public get slotData(): Readonly<TSlotData> {
        return this.#slotData;
    }

    /**
     * Send a chat message to the server.
     * @param message The message content to broadcast.
     * @throws Error If not connected and authenticated to an Archipelago server.
     */
    public say(message: string): void {
        if (this.socket.status !== ConnectionStatus.Connected) {
            throw new Error("Cannot send chat messages while not connected and authenticated to server.");
        }

        this.socket.send({ cmd: ClientPacketType.Say, text: message.trim() });
    }

    /**
     * Set or clear the alias for the current client.
     * @param value The value to change the alias to. If empty/omitted, any existing alias will be cleared.
     */
    public setAlias(value: string = ""): void {
        if (this.socket.status !== ConnectionStatus.Connected) {
            throw new Error("Cannot send chat messages while not connected and authenticated to server.");
        }

        this.socket.send({ cmd: ClientPacketType.Say, text: `!alias ${value.trim()}` });
    }

    #initializeFields(): void {
        this.#team = -1;
        this.#slot = -1;
        this.#hintPoints = 0;
        this.#slotData = {} as TSlotData;
        this.#checkedLocations = new Set();
        this.#missingLocations = new Set();
    }
}
