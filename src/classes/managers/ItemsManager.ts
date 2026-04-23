import { NetworkHint, NetworkItem } from "../../api";
import { ItemEvents } from "../../events/ItemEvents.ts";
import { Client } from "../Client.ts";
import { Hint } from "../Hint.ts";
import { Item } from "../Item.ts";
import { Player } from "../Player.ts";
import { DataChangeCallback } from "./DataStorageManager.ts";
import { EventBasedManager } from "./EventBasedManager.ts";

/**
 * Manages tracking and receiving of all received items and hints.
 */
export class ItemsManager extends EventBasedManager<ItemEvents> {
    readonly #client: Client;
    #received: Item[] = [];
    #hints: Hint[] = [];
    #hintIndexLookup = new Map<string, number>();

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
                        this.#client.players.findPlayer(networkItem.player) as Player,
                        this.#client.players.self,
                    );
                }

                this.emit("itemsReceived", [this.#received.slice(packet.index, packet.index + count), packet.index]);
            })
            .on("connected", () => {
                this.#hints = [];
                this.#hintIndexLookup = new Map();
                this.#received = [];
                this.#client.storage
                    .notify(
                        [`_read_hints_${this.#client.players.self.team}_${this.#client.players.self.slot}`],
                        this.#receivedHint.bind(this) as DataChangeCallback,
                    )
                    .then((data) => {
                        const hints = data[`_read_hints_${this.#client.players.self.team}_${this.#client.players.self.slot}`] as NetworkHint[];
                        this.#hints = hints.map((hint, index) => {
                            const newHint = new Hint(this.#client, hint);
                            this.#hintIndexLookup.set(newHint.uniqueKey, index);
                            return newHint;
                        });
                        this.emit("hintsInitialized", [[...this.#hints]]);
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
        return Object.values(this.#hints);
    }

    /** Return the number of items received. */
    public get count(): number {
        return this.#received.length;
    }

    #receivedHint(_: string, hints: NetworkHint[]): void {
        for (const hint of hints) {
            const networkHintKey = Hint.getUniqueKey(hint);
            const matchingHintIndex = this.#hintIndexLookup.get(networkHintKey);
            if (matchingHintIndex !== undefined && this.#hints[matchingHintIndex].status !== hint.status) {
                const newHint = new Hint(this.#client, hint);
                this.#hints[matchingHintIndex] = newHint;
                if (hint.found) {
                    this.emit("hintFound", [newHint]);
                }
                this.emit("hintUpdated", [newHint]);
            } else if (matchingHintIndex === undefined) {
                const newHint = new Hint(this.#client, hint);
                this.#hintIndexLookup.set(newHint.uniqueKey, this.#hints.length);
                this.#hints.push(newHint);
                this.emit("hintReceived", [newHint]);
            }
        }
    }
}
