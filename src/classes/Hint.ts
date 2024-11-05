import { NetworkHint } from "../api";
import { Client } from "./Client.ts";
import { Item } from "./Item.ts";
import { Player } from "./Player.ts";

/**
 * An abstraction of {@link NetworkHint} that exposes additional helper methods and accessors received hint data.
 */
export class Hint {
    readonly #client: Client;
    readonly #hint: NetworkHint;
    readonly #item: Item;

    /**
     * Instantiates a new ItemMetadata.
     * @internal
     * @param client The Archipelago client associated with this manager.
     * @param hint The network hint object.
     */
    public constructor(client: Client, hint: NetworkHint) {
        this.#client = client;
        this.#hint = hint;
        this.#item = new Item(
            this.#client,
            { item: hint.item, location: hint.location, player: hint.finding_player, flags: hint.item_flags },
            this.#client.players.findPlayer(this.#client.players.self.team, hint.finding_player) as Player,
            this.#client.players.findPlayer(this.#client.players.self.team, hint.receiving_player) as Player,
        );
    }

    /** Returns the item contained in this hint. */
    public get item(): Item {
        return this.#item;
    }

    /** Returns `true` if this item has been found. */
    get found(): boolean {
        return this.#hint.found;
    }

    /** Returns the entrance this location is at if entrance data is available, otherwise `"Vanilla"`. */
    get entrance(): string {
        return this.#hint.entrance || "Vanilla";
    }
}
