import { ArchipelagoClient } from "@structs";
import { CommandPacketType } from "@enums";

export class LocationsManager {
    private _client: ArchipelagoClient;

    public constructor(client: ArchipelagoClient) {
        this._client = client;
    }

    public check(...locationIds: number[]): void {
        this._client.send({
            cmd: CommandPacketType.LOCATION_CHECKS,
            locations: locationIds,
        });
    }
}
