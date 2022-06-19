import { Client } from "../index";
import { GameData, NetworkPlayer } from "../structs";
/**
 * Manages and watches for events regarding session data and the data package. Most other mangers use this
 * information to create helper functions and track other information.
 */
export declare class DataManager {
    private _client;
    private _dataPackage;
    private _locations;
    private _items;
    private _players;
    /**
     * Creates a new {@link DataManager} and sets up events on the {@link Client} to listen for to start
     * updating it's internal state.
     *
     * @param client The {@link Client} that should be managing this manager.
     */
    constructor(client: Client);
    /**
     * Returns a map of all {@link GameData} mapped to their game `name`.
     */
    get package(): ReadonlyMap<string, GameData>;
    /**
     * Returns a map of all location `names` mapped to their `id`.
     */
    get locations(): ReadonlyMap<number, string>;
    /**
     * Returns a map of all item `names` mapped to their `id`.
     */
    get items(): ReadonlyMap<number, string>;
    /**
     * Returns a map of all `players` mapped to their slot `id`.
     */
    get players(): ReadonlyMap<number, NetworkPlayer>;
    private onDataPackage;
    private onConnected;
    private onRoomUpdate;
}
//# sourceMappingURL=DataManager.d.ts.map