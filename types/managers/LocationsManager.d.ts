import { Client } from "../index";
/**
 * Managers and watches for events regarding location data and provides helper functions to make checking,
 * scouting, or working with locations in general easier.
 */
export declare class LocationsManager {
    private _client;
    private _checked;
    private _missing;
    /**
     * Creates a new {@link LocationsManager} and sets up events on the {@link Client} to listen for to start
     * updating it's internal state.
     *
     * @param client The {@link Client} that should be managing this manager.
     */
    constructor(client: Client);
    /**
     * Check a list of locations and mark the locations as found.
     *
     * @param locationIds A list of location ids.
     */
    check(...locationIds: number[]): void;
    /**
     * Scout a list of locations without marking the locations as found.
     *
     * @param hint Create a hint for these locations.
     * @param locationIds A list of location ids.
     */
    scout(hint?: boolean, ...locationIds: number[]): void;
    /**
     * Returns the `name` of a given location `id`.
     *
     * Special cases:
     *
     * - If location id is `-1`, returns `Cheat Console`.
     * - If location id is `-2`, returns `Server`.
     *
     * @param locationId The `id` of a location. Returns "Unknown Location #" if the location does not exist
     *   in the data package.
     */
    name(locationId: number): string;
    /**
     * An array of all checked locations.
     */
    get checked(): ReadonlyArray<number>;
    /**
     * An array of all locations that are not checked.
     */
    get missing(): ReadonlyArray<number>;
    private onConnected;
    private onRoomUpdate;
}
//# sourceMappingURL=LocationsManager.d.ts.map