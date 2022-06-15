import { ArchipelagoClient } from "@structs";

export class ItemsManager {
    private _client: ArchipelagoClient;

    public constructor(client: ArchipelagoClient) {
        this._client = client;
    }

    /**
     * Returns the name of a given player id.
     * @param playerId
     */
    public name(playerId: number): string {
        return this._client.data.players.get(playerId)?.name ?? `Unknown Player ${playerId}`;
    }

    /**
     * Returns the alias of a given player id.
     * @param playerId
     */
    public alias(playerId: number): string {
        return this._client.data.players.get(playerId)?.name ?? `Unknown Player ${playerId}`;
    }

    /**
     * Returns the name and alias of a given item id.
     * @param playerId
     */
    public nameAndAlias(playerId: number): string {
        const player = this._client.data.players.get(playerId);
        if (player) {
            return `${player.name} (${player.alias})`;
        } else {
            return `Unknown Player ${playerId}`;
        }
    }
}
