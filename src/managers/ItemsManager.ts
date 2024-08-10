import { Client } from "../Client";
import { CLIENT_PACKET_TYPE, SERVER_PACKET_TYPE } from "../consts/CommandPacketType";
import { ReceivedItemsPacket } from "../packets/ReceivedItemsPacket";
import { NetworkItem } from "../types";

/**
 * Manages and watches for events regarding item data and provides helper functions to make working with items easier.
 */
export class ItemsManager {
    #client: Client<unknown>;
    #items: NetworkItem[] = [];
    #index = 0;

    /**
     * Creates a new {@link ItemsManager} and sets up events on the {@link Client} to listen for to start
     * updating its internal state.
     *
     * @param client The {@link Client} that should be managing this manager.
     */
    public constructor(client: Client<unknown>) {
        this.#client = client;
        this.#client.addListener(SERVER_PACKET_TYPE.RECEIVED_ITEMS, this.#onReceivedItems.bind(this));
    }

    /**
     * Returns the `name` of a given item `id`.
     *
     * @param player The `id` of the player this item belongs to.
     * @param id The `id` of this item.
     * @returns Returns the name of the item or `Unknown Item: <id>` if item or player is not in data.
     *
     * @throws Throws an error if `player` or `id` is not a safe integer.
     */
    public name(player: number, id: number): string;

    /**
     * Returns the `name` of a given item `id`.
     *
     * @param game The `name` of the game this item belongs to.
     * @param id The `id` of this item.
     * @returns Returns the name of the item or `Unknown Item: <id>` if item or player is not in data.
     *
     * @throws Throws an error if `id` is not a safe integer.
     */
    public name(game: string, id: number): string;

    public name(value: string | number, id: number): string {
        if (isNaN(id) || !Number.isSafeInteger(id)) {
            throw new Error(`'id' must be a safe integer. Received: ${id}`);
        }

        let game: string;
        if (typeof value === "string") {
            game = value;
        } else {
            if (isNaN(value) || !Number.isSafeInteger(value)) {
                throw new Error(`'player' must be a safe integer. Received: ${id}`);
            }

            const player = this.#client.players.get(value);
            if (!player) {
                return `Unknown Item: ${id}`;
            }

            game = player.game;
        }

        const gameData = this.#client.data.package.get(game);
        if (!gameData) {
            return `Unknown Item: ${id}`;
        }

        const name = gameData.item_id_to_name[id];
        if (!name) {
            return `Unknown Item: ${id}`;
        }

        return name;
    }

    /**
     * Returns a list of all item names in a given group.
     *
     * @param game
     * @param name
     *
     * @throws Throws an error if unable to find game for group in data package.
     */
    public group(game: string, name: string): string[] {
        const gameData = this.#client.data.package.get(game);
        if (!gameData) {
            throw new Error(`Unknown Game: ${game}`);
        }

        const group = gameData.item_name_groups[name];
        if (!group) {
            return [];
        }

        return group;
    }

    /**
     * Returns the current item index. If this value is larger than expected, that means new items have been received.
     */
    public get index(): number {
        return this.#index;
    }

    /**
     * Returns an array of all items that have been received.
     */
    public get received(): ReadonlyArray<NetworkItem> {
        return this.#items;
    }

    #onReceivedItems(packet: ReceivedItemsPacket): void {
        // De-sync occurred! Attempt a re-sync before continuing.
        if (packet.index > this.#index) {
            this.#index = 0;
            this.#client.send({
                cmd: CLIENT_PACKET_TYPE.SYNC,
            });
            return;
        }

        let index = packet.index;
        for (const item of packet.items) {
            this.#items[index++] = item;
        }

        this.#index = index;
    }
}
