import { itemClassifications, NetworkItem } from "../api";
import { Client } from "./Client.ts";
import { Player } from "./Player.ts";

/**
 * An abstraction of {@link NetworkItem} that exposes additional helper methods and accessors for this item data.
 */
export class Item {
    readonly #client: Client;
    readonly #item: NetworkItem;
    readonly #sender: Player;
    readonly #receiver: Player;

    /**
     * Instantiates a new ItemMetadata.
     * @internal
     * @param client The Archipelago client associated with this manager.
     * @param item The network item data from the network protocol.
     * @param sender The player to send this item.
     * @param receiver The player to receive this item.
     */
    public constructor(client: Client, item: NetworkItem, sender: Player, receiver: Player) {
        this.#client = client;
        this.#item = item;
        this.#sender = sender;
        this.#receiver = receiver;
    }

    /** Returns the name of this item. */
    public toString(): string {
        return this.name;
    }

    /** Returns the metadata for the player who receives this item. */
    get receiver(): Player {
        return this.#receiver;
    }

    /** Returns the metadata for the player who finds this item. */
    get sender(): Player {
        return this.#sender;
    }

    /** Returns the name of this item. */
    public get name(): string {
        return this.#client.package.lookupItemName(this.game, this.#item.item, true);
    }

    /** Returns the integer id of this item. */
    public get id(): number {
        return this.#item.item;
    }

    /** Returns the name of the location where this item was contained. */
    public get locationName(): string {
        return this.#client.package.lookupLocationName(this.sender.game, this.#item.location, true);
    }

    /** Returns the id of the location where this item was contained. */
    public get locationId(): number {
        return this.#item.location;
    }

    /** Returns the game name for the location this item was contained. */
    public get locationGame(): string {
        return this.sender.game;
    }

    /** Returns the game name for this item. */
    public get game(): string {
        return this.receiver.game;
    }

    /** Returns `true` if this item is flagged as progression. */
    public get progression(): boolean {
        return (this.flags & itemClassifications.progression) === itemClassifications.progression;
    }

    /** Returns `true` if this item is flagged as useful. */
    public get useful(): boolean {
        return (this.flags & itemClassifications.useful) === itemClassifications.useful;
    }

    /** Returns `true` if this item is flagged as a trap. */
    public get trap(): boolean {
        return (this.flags & itemClassifications.trap) === itemClassifications.trap;
    }

    /** Returns `true` if this item has no special flags. */
    public get filler(): boolean {
        return this.flags === itemClassifications.normal;
    }

    /** Returns the item classification bitflags for this item. */
    public get flags(): number {
        return this.#item.flags;
    }
}
