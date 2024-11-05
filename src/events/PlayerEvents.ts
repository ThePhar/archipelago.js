import { Player } from "../classes/Player.ts";

export type PlayerEvents = {
    /**
     * Fires when a player updates their alias.
     * @param player The {@link Player} for this player with the changes applied.
     * @param oldAlias The player's previous alias.
     * @param newAlias The player's new alias.
     */
    aliasUpdated: [player: Player, oldAlias: string, newAlias: string]
};
