import { Client } from "./Client.ts";
import { ClientPacketType, ServerPacketType } from "./CommandPacketType.ts";
import { CreateAsHintMode } from "./CreateAsHintMode.ts";
import { ConnectedPacket } from "./ConnectedPacket.ts";
import { RoomUpdatePacket } from "./RoomUpdatePacket.ts";

/**
 * Manages and watches for events regarding location data and provides helper functions to make checking, scouting, or
 * working with locations in general easier.
 */
export class LocationsManager {
    #client: Client<unknown>;
    #checked: number[] = [];
    #missing: number[] = [];

    /**
     * Creates a new {@link LocationsManager} and sets up events on the {@link Client} to listen for to start
     * updating its internal state.
     *
     * @param client The {@link Client} that should be managing this manager.
     */
    public constructor(client: Client<unknown>) {
        this.#client = client;
        this.#client.addListener(ServerPacketType.CONNECTED, this.#onConnected.bind(this));
        this.#client.addListener(ServerPacketType.ROOM_UPDATE, this.#onRoomUpdate.bind(this));
    }

    /**
     * An array of all checked locations.
     */
    public get checked(): ReadonlyArray<number> {
        return this.#checked;
    }

    /**
     * An array of all locations that are not checked.
     */
    public get missing(): ReadonlyArray<number> {
        return this.#missing;
    }

    /**
     * Check a list of locations and mark the locations as found.
     *
     * @param locationIds A list of location ids.
     */
    public check(...locationIds: number[]): void {
        this.#client.send({
            cmd: ClientPacketType.LOCATION_CHECKS,
            locations: locationIds,
        });
    }

    /**
     * Scout a list of locations without marking the locations as found.
     *
     * @param hint Create a hint for these locations.
     * @param locationIds A list of location ids.
     */
    public scout(hint = CreateAsHintMode.NO_HINT, ...locationIds: number[]): void {
        this.#client.send({
            cmd: ClientPacketType.LOCATION_SCOUTS,
            locations: locationIds,
            create_as_hint: hint,
        });
    }

    /**
     * Returns the `name` of a given location `id`.
     *
     * @param game The `name` of the game this location belongs to.
     * @param id The `id` of this location.
     * @returns Returns the name of the location or `Unknown <Game> Location: <Id>` if location or game is not in data
     * package.
     *
     * @throws Throws an error if `id` is not a safe integer.
     */
    public name(game: string, id: number): string {
        if (isNaN(id) || !Number.isSafeInteger(id)) {
            throw new Error(`'id' must be a safe integer. Received: ${id}`);
        }

        const gameData = this.#client.data.package.get(game);
        if (!gameData) {
            return `Unknown ${game} Location: ${id}`;
        }

        const name = gameData.location_id_to_name[id];
        if (!name) {
            return `Unknown ${game} Location: ${id}`;
        }

        return name;
    }

    /**
     * Returns the `id` of a given location `name`.
     *
     * @param game The `name` of the game this location belongs to.
     * @param name The `name` of this location.
     *
     * @throws Throws an error if unable to find the `id` for a location or unable to find game in data package.
     */
    public id(game: string, name: string): number {
        const gameData = this.#client.data.package.get(game);
        if (!gameData) {
            throw new Error(`Unknown game: ${game}`);
        }

        const id = gameData.location_name_to_id[name];
        if (!id) {
            throw new Error(`Unknown location name: ${name}`);
        }

        return id;
    }

    /**
     * Returns a list of all location names in a given group.
     *
     * @param game
     * @param name
     *
     * @throws Throws an error if unable to find game for group in data package.
     */
    public group(game: string, name: string): string[] {
        const gameData = this.#client.data.package.get(game);
        if (!gameData) {
            throw new Error(`Unknown game: ${game}`);
        }

        const group = gameData.location_name_groups[name];
        if (!group) {
            return [];
        }

        return group;
    }

    /**
     * Sends out all missing locations as checked.
     */
    public autoRelease(): void {
        this.#client.send({
            cmd: ClientPacketType.LOCATION_CHECKS,
            locations: this.#missing,
        });
    }

    #onConnected(packet: ConnectedPacket): void {
        this.#checked = packet.checked_locations;
        this.#missing = packet.missing_locations;
    }

    #onRoomUpdate(packet: RoomUpdatePacket): void {
        // Update our checked/missing arrays.
        if (packet.checked_locations) {
            for (const location of packet.checked_locations) {
                if (!this.#checked.includes(location)) {
                    this.#checked.push(location);

                    // Remove from missing locations array as well.
                    const index = this.#missing.indexOf(location);
                    if (index !== -1) {
                        this.#missing.splice(index, 1);
                    }
                }
            }
        }
    }
}
