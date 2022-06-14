import { ArchipelagoClient } from "@structs";
import { CommandPacketType } from "@enums";

export class LocationsManager {
    private _client: ArchipelagoClient;

    public constructor(client: ArchipelagoClient) {
        this._client = client;
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
}
