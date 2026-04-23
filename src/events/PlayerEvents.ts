import { Player } from "../classes/Player.ts";

/* eslint-disable @typescript-eslint/consistent-type-definitions --
 *
 * Since this has already shipped, it's TECHNICALLY a breaking change to turn all of these into interfaces.
 * While it's highly unlikely that anyone would ever notice, let's save such things for the next major version bump.
 */

export type PlayerEvents = {
    /**
     * Fires when a player updates their alias.
     * @param player The {@link Player} for this player with the changes applied.
     * @param oldAlias The player's previous alias.
     * @param newAlias The player's new alias.
     */
    aliasUpdated: [player: Player, oldAlias: string, newAlias: string]
};

/* eslint-enable @typescript-eslint/consistent-type-definitions */
