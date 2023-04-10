import { CommandPacketType, CreateAsHintMode } from "../enums";
import { ArchipelagoClient } from "../index";
import { ConnectedPacket, RoomUpdatePacket } from "../packets";

/**
 * Managers and watches for events regarding location data and provides helper functions to make checking, scouting, or
 * working with locations in general easier.
 */
export class LocationsManager {
    private _client: ArchipelagoClient;
    private _checked: number[] = [];
    private _missing: number[] = [];

    /**
     * Creates a new {@link LocationsManager} and sets up events on the {@link ArchipelagoClient} to listen for to start
     * updating its internal state.
     *
     * @param client The {@link ArchipelagoClient} that should be managing this manager.
     */
    public constructor(client: ArchipelagoClient) {
        this._client = client;
        this._client.addListener("connected", this.onConnected.bind(this));
        this._client.addListener("roomUpdate", this.onRoomUpdate.bind(this));
    }

    /**
     * Check a list of locations and mark the locations as found.
     *
     * @param locationIds A list of location ids.
     */
    public check(...locationIds: number[]): void {
        this._client.send({
            cmd: CommandPacketType.LOCATION_CHECKS,
            locations: locationIds,
        });
    }

    /**
     * Scout a list of locations without marking the locations as found.
     *
     * @param hint Create a hint for these locations.
     * @param locationIds A list of location ids.
     */
    public scout(hint = CreateAsHintMode.NO_HINT, ...locationIds: number[]): void {
        this._client.send({
            cmd: CommandPacketType.LOCATION_SCOUTS,
            locations: locationIds,
            create_as_hint: hint,
        });
    }

    /**
     * Returns the `name` of a given location `id`.
     *
     * Special cases:
     * - If location id is `-1`, returns `Cheat Console`.
     * - If location id is `-2`, returns `Server`.
     *
     * @param locationId The `id` of a location. Returns "Unknown Location #" if the location does not exist in the data
     * package.
     */
    public name(locationId: number): string {
        switch (locationId) {
            case -1:
                return "Cheat Console";
            case -2:
                return "Server";
            default:
                return this._client.data.locations.get(locationId) ?? `Unknown Location ${locationId}`;
        }
    }

    /**
     * An array of all checked locations.
     */
    public get checked(): ReadonlyArray<number> {
        return this._checked;
    }

    /**
     * An array of all locations that are not checked.
     */
    public get missing(): ReadonlyArray<number> {
        return this._missing;
    }

    private onConnected(packet: ConnectedPacket): void {
        this._checked = packet.checked_locations;
        this._missing = packet.missing_locations;
    }

    private onRoomUpdate(packet: RoomUpdatePacket): void {
        // Update our checked/missing arrays.
        if (packet.checked_locations) {
            for (const location of packet.checked_locations) {
                if (!this._checked.includes(location)) this._checked.push(location);

                // Remove from missing locations array as well.
                const index = this._missing.indexOf(location);
                if (index !== -1) {
                    this._missing = this._missing.splice(index, 1);
                }
            }
        }

        // TODO: Does AP actually send missing locations?
        if (packet.missing_locations) {
            for (const location of packet.missing_locations) {
                this._missing.filter((missing) => missing !== location);
            }
        }
    }
}
