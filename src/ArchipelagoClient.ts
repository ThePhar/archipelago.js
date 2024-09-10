import { ChatManager } from "./managers/ChatManager.ts";
import { DataStorageManager } from "./managers/DataStorageManager.ts";
import { ItemsManager } from "./managers/ItemsManager.ts";
import { LocationsManager } from "./managers/LocationsManager.ts";
import { PlayersManager } from "./managers/PlayersManager.ts";
import { RoomManager } from "./managers/RoomManager.ts";
import { SocketManager } from "./managers/SocketManager.ts";

/**
 * The client that connects to an Archipelago server, facilitates communication, and keeps track of room/player state.
 * @example
 * import { ArchipelagoClient } from "@pharware/archipelago";
 *
 * const client = new ArchipelagoClient();
 */
export class ArchipelagoClient {
    #game: string = "";

    /** A helper object for logging and sending messages via the Archipelago chat. */
    public readonly chat: ChatManager = new ChatManager(this);
    /** A helper object for tracking and communciating to/from the AP data storage API. */
    public readonly data: DataStorageManager = new DataStorageManager(this);
    /** A helper object for tracking received items in the session. */
    public readonly items: ItemsManager = new ItemsManager(this);
    /** A helper object for tracking, scouting, and checking locations in the session. */
    public readonly locations: LocationsManager = new LocationsManager(this);
    /** A helper object for managing all players and their respective states in the session. */
    public readonly players: PlayersManager = new PlayersManager(this);
    /** A helper object for managing room state information. */
    public readonly room: RoomManager = new RoomManager(this);
    /** A helper object for managing the web socket and communicating directly with the AP network protocol. */
    public readonly socket: SocketManager = new SocketManager();

    /** The name of the game associated with this client. */
    public get game(): string {
        return this.#game;
    }
}
