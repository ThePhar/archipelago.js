import { Client } from "../Client";
import { CLIENT_PACKET_TYPE, SERVER_PACKET_TYPE } from "../consts/CommandPacketType";
import { CREATE_AS_HINT_MODE } from "../consts/CreateAsHintMode";
import { ConnectedPacket } from "../packets/ConnectedPacket";
import { RoomUpdatePacket } from "../packets/RoomUpdatePacket";

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
        this.#client.addListener(SERVER_PACKET_TYPE.CONNECTED, this.#onConnected.bind(this));
        this.#client.addListener(SERVER_PACKET_TYPE.ROOM_UPDATE, this.#onRoomUpdate.bind(this));
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
            cmd: CLIENT_PACKET_TYPE.LOCATION_CHECKS,
            locations: locationIds,
        });
    }

    /**
     * Scout a list of locations without marking the locations as found.
     *
     * @param hint Create a hint for these locations.
     * @param locationIds A list of location ids.
     */
    public scout(hint = CREATE_AS_HINT_MODE.NO_HINT, ...locationIds: number[]): void {
        this.#client.send({
            cmd: CLIENT_PACKET_TYPE.LOCATION_SCOUTS,
            locations: locationIds,
            create_as_hint: hint,
        });
    }

    /**
     * Returns the `name` of a given location `id`.
     *
     * @param player The `id` of the player this location belongs to.
     * @param id The `id` of this location.
     * @returns Returns the name of the location or `Unknown Location: <id>` if location or player is not in data.
     *
     * @throws Throws an error if `player` or `id` is not a safe integer.
     */
    public name(player: number, id: number): string;

    /**
     * Returns the `name` of a given location `id`.
     *
     * @param game The `name` of the game this location belongs to.
     * @param id The `id` of this location.
     * @returns Returns the name of the location or `Unknown Location: <id>` if location or player is not in data.
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
                return `Unknown Location: ${id}`;
            }

            game = player.game;
        }

        const gameData = this.#client.data.package.get(game);
        if (!gameData) {
            return `Unknown Location: ${id}`;
        }

        const name = gameData.location_id_to_name[id];
        if (!name) {
            return `Unknown Location: ${id}`;
        }

        return name;
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
            throw new Error(`Unknown Game: ${game}`);
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
            cmd: CLIENT_PACKET_TYPE.LOCATION_CHECKS,
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
