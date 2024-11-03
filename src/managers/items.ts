import { itemClassifications, NetworkHint, NetworkItem } from "../api";
import { Client } from "../client.ts";
import { EventBasedManager } from "./abstract.ts";
import { Player } from "./players.ts";
import { DataChangeCallback } from "./storage.ts";

/**
 * Manages tracking and receiving of all received items and hints.
 */
export class ItemsManager extends EventBasedManager<ItemEvents> {
    readonly #client: Client;
    #received: Item[] = [];
    #hints: Hint[] = [];

    /**
     * Instantiates a new ItemsManager.
     * @internal
     * @param client The Archipelago client associated with this manager.
     */
    public constructor(client: Client) {
        super();
        this.#client = client;

        this.#client.socket
            .on("receivedItems", (packet) => {
                let index = packet.index;
                const count = packet.items.length;
                const items = [...packet.items]; // Shallow copy to prevent modifying the received items.
                while (items.length > 0) {
                // Update received items cache at index, then increment the index value (postfix).
                    const networkItem = items.shift() as NetworkItem;
                    this.#received[index++] = new Item(
                        this.#client,
                        networkItem,
                        this.#client.players.findPlayer(this.#client.players.self.team, networkItem.player) as Player,
                        this.#client.players.self,
                    );
                }

                this.emit("itemsReceived", [this.#received.slice(packet.index, packet.index + count), packet.index]);
            })
            .on("connected", () => {
                this.#hints = [];
                this.#received = [];
                this.#client.storage
                    .notify(
                        [`_read_hints_${this.#client.players.self.team}_${this.#client.players.self.slot}`],
                        this.#receivedHint.bind(this) as DataChangeCallback,
                    )
                    .then((data) => {
                        const hints = data[`_read_hints_${this.#client.players.self.team}_${this.#client.players.self.slot}`] as NetworkHint[];
                        this.#hints = hints.map((hint) => new Hint(this.#client, hint));
                        this.emit("hintsInitialized", [this.#hints]);
                    })
                    .catch((error) => {
                        throw error;
                    });
            });
    }

    /** Returns a copy of all items ever received. */
    public get received(): Item[] {
        return [...this.#received];
    }

    /**
     * Returns a copy of all hints for this player.
     * @remarks Hints may take a moment to populate after establishing connection to server, as it needs to wait for
     * data storage to fetch all current hints. If you need hints right after connecting, listen for the
     * {@link ItemEvents.hintsInitialized} event.
     */
    public get hints(): Hint[] {
        return [...this.#hints];
    }

    /** Return the number of items received. */
    public get count(): number {
        return this.#received.length;
    }

    #receivedHint(_: string, hints: NetworkHint[]): void {
        for (let i = 0; i < hints.length; i++) {
            if (this.#hints[i] === undefined) {
                this.#hints[i] = new Hint(this.#client, hints[i]);
                this.emit("hintReceived", [this.#hints[i]]);
            } else if (this.#hints[i].found !== hints[i].found) {
                this.#hints[i] = new Hint(this.#client, hints[i]);
                this.emit("hintFound", [this.#hints[i]]);
            }
        }
    }
}

/**
 * An interface with all supported item/hint events and their respective callback arguments. To be called from
 * {@link ItemsManager}.
 */
export type ItemEvents = {
    /**
     * Fired when items have been received.
     * @param items An array of item metadata in the order they are sent.
     * @param startingIndex The {@link ItemsManager.received} index for the first item in the `items` array.
     */
    itemsReceived: [items: Item[], startingIndex: number]

    /**
     * Fired when a new hint has been received.
     * @param hint The hint that has been created.
     */
    hintReceived: [hint: Hint]

    /**
     * Fired when a hint has been found.
     * @param hint The hint that has been found.
     */
    hintFound: [hint: Hint]

    /**
     * Fired shortly after initial connection with all current hints relevant to this player.
     * @param hints All hints ever created relevant to this player.
     */
    hintsInitialized: [hints: Hint[]]
};

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
