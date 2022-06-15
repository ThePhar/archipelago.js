import { CommandPacketType } from "@enums";
import { ArchipelagoClient } from "@structs";
import { ConnectedPacket, RoomUpdatePacket } from "@packets";

export class LocationsManager {
    private _client: ArchipelagoClient;
    private _checked: number[] = [];
    private _missing: number[] = [];

    public constructor(client: ArchipelagoClient) {
        this._client = client;
        this._client.addListener("connected", this.onConnected.bind(this));
        this._client.addListener("roomUpdate", this.onRoomUpdate.bind(this));
    }

    /**
     * Check a list of locations.
     * @param locationIds
     */
    public check(...locationIds: number[]): void {
        this._client.send({
            cmd: CommandPacketType.LOCATION_CHECKS,
            locations: locationIds,
        });
    }

    /**
     * Scout a list of locations.
     * @param hint Create a hint for these locations.
     * @param locationIds
     */
    public scout(hint = false, ...locationIds: number[]): void {
        this._client.send({
            cmd: CommandPacketType.LOCATION_SCOUTS,
            locations: locationIds,
            create_as_hint: hint,
        });
    }

    /**
     * Returns the name of a given location id.
     * @param locationId
     */
    public name(locationId: number): string {
        return this._client.data.locations.get(locationId) ?? `Unknown Location ${locationId}`;
    }

    /**
     * An array of all checked locations.
     */
    public checked(): ReadonlyArray<number> {
        return this._checked;
    }

    /**
     * An array of all locations that are not checked.
     */
    public missing(): ReadonlyArray<number> {
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
            }
        }

        if (packet.missing_locations) {
            for (const location of packet.missing_locations) {
                this._missing.filter((missing) => missing !== location);
            }
        }
    }
}
