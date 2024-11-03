import { itemClassifications, NetworkItem } from "../api";
import { Client } from "../client.ts";
import { EventBasedManager } from "./abstract.ts";
import { PlayerMetadata } from "./players.ts";

/**
 * Manages tracking and receiving of all items received.
 */
export class ItemsManager extends EventBasedManager<ItemEvents> {
    readonly #client: Client;
    readonly #received: ItemMetadata[] = [];

    /**
     * Instantiates a new ItemsManager.
     * @internal
     * @param client The Archipelago client associated with this manager.
     */
    public constructor(client: Client) {
        super();
        this.#client = client;

        this.#client.socket.on("receivedItems", (packet) => {
            let index = packet.index;
            const count = packet.items.length;
            const items = [...packet.items]; // Shallow copy to prevent modifying the received items.
            while (items.length > 0) {
                // Update received items cache at index, then increment the index value (postfix).
                const networkItem = items.shift() as NetworkItem;
                this.#received[index++] = new ItemMetadata(
                    this.#client,
                    networkItem,
                    this.#client.players.findPlayer(this.#client.players.self.team, networkItem.player) as PlayerMetadata,
                    this.#client.players.self,
                );
            }

            this.emit("itemsReceived", [this.#received.slice(packet.index, count), packet.index]);
        });
    }

    /** Returns a copy of all items ever received. */
    public get received(): ItemMetadata[] {
        return [...this.#received];
    }

    /** Return the number of items received. */
    public get count(): number {
        return this.#received.length;
    }
}

export type ItemEvents = {
    /**
     * Fired when items have been received.
     * @param items An array of item metadata in the order they are sent.
     * @param startingIndex The {@link ItemsManager.received} index for the first item in the `items` array.
     */
    itemsReceived: [items: ItemMetadata[], startingIndex: number]
};

/**
 * An abstraction of {@link NetworkItem} that exposes additional helper methods and accessors for this item data.
 */
export class ItemMetadata {
    readonly #client: Client;
    readonly #item: NetworkItem;
    readonly #sender: PlayerMetadata;
    readonly #receiver: PlayerMetadata;

    /**
     * Instantiates a new ItemMetadata.
     * @internal
     * @param client The Archipelago client associated with this manager.
     * @param item The network item data from the network protocol.
     * @param sender The player to send this item.
     * @param receiver The player to receive this item.
     */
    public constructor(client: Client, item: NetworkItem, sender: PlayerMetadata, receiver: PlayerMetadata) {
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
    get receiver(): PlayerMetadata {
        return this.#receiver;
    }

    /** Returns the metadata for the player who finds this item. */
    get sender(): PlayerMetadata {
        return this.#sender;
    }

    /** Returns the name of this item. */
    public get name(): string {
        return this.#client.package.lookupItemName(this.game, this.#item.item, true);
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
