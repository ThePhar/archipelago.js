import { PermissionTable } from "../api";
import { Client } from "../client.ts";
import { EventBasedManager } from "./abstract.ts";

export class RoomStateManager extends EventBasedManager<RoomStateEvents> {
    readonly #client: Client;
    #serverVersion = { major: -1, minor: -1, build: -1 };
    #generatorVersion = { major: -1, minor: -1, build: -1 };
    #games: string[] = [];
    #tags: string[] = [];
    #seed = "";
    #locations = 0;
    #password = false;
    #hintPoints = 0;
    #hintCost = 0;
    #locationCheckPoints = 0;
    #permissions: PermissionTable = { release: 0, collect: 0, remaining: 0 };
    #race = false;

    /**
     * Returns the version of Archipelago the server is currently running.
     * @remarks All properties will be `-1` prior to initial connection.
     */
    public get serverVersion(): { major: number, minor: number, build: number } {
        return { ...this.#serverVersion };
    }

    /**
     * Returns the version of Archipelago the seed was generated from.
     * @remarks All properties will be `-1` prior to initial connection.
     */
    public get generatorVersion(): { major: number, minor: number, build: number } {
        return { ...this.#generatorVersion };
    }

    /** Returns the list of games present in the current room. */
    public get games(): string[] {
        return [...this.#games];
    }

    /** Returns a list of tags the server is currently capable of. */
    public get tags(): string[] {
        return [...this.#tags];
    }

    /**
     * Get the seed name for this room.
     * @remarks In non-race seeds, this is based on the seed to generate this multi-world, but not exactly the same to
     * prevent reverse engineering. In race seeds, this is completely random.
     */
    public get seedName(): string {
        return this.#seed;
    }

    /** Returns `true` if the room requires a password to join. */
    public get password(): boolean {
        return this.#password;
    }

    // TODO Write these when tracking of data storage is set up (to watch client status)
    // public get canRelease(): boolean { }
    // public get canCollect(): boolean { }
    // public get canRemaining(): boolean { }

    /** Returns the current room's command permission bitflags. */
    public get permissions(): PermissionTable {
        return { ...this.#permissions };
    }

    /** Returns the amount of hint points this player currently has. */
    public get hintPoints(): number {
        return this.#hintPoints;
    }

    /** Returns the amount of hint points this player needs to request a hint. */
    public get hintCost(): number {
        if (this.hintCostPercentage > 0) {
            // TODO: replace this.#locations with locations manager
            return Math.max(1, Math.floor(this.hintCostPercentage * this.#locations * 0.01));
        }

        return 0;
    }

    /** Returns the percentage of locations that need to be checked to have enough points to hint from the server. */
    public get hintCostPercentage(): number {
        return this.#hintCost;
    }

    /** Returns the amount of hint points received per location checked. */
    public get locationCheckPoints(): number {
        return this.#locationCheckPoints;
    }

    /**
     * Returns if this seed was generated with race mode enabled (to be used to obscure unnecessary details to make
     * clients race legal depending on rules).
     * @experimental
     */
    public get race(): boolean {
        return this.#race;
    }

    /**
     * Instantiates a new RoomStateManager. Should only be instantiated by creating a new {@link Client}.
     * @internal
     * @param client The client object this manager is associated with.
     */
    public constructor(client: Client) {
        super();
        this.#client = client;

        // Event handlers
        this.#client.socket
            .on("roomInfo", (packet) => {
                this.#serverVersion = {
                    major: packet.version.major,
                    minor: packet.version.minor,
                    build: packet.version.build,
                };
                this.#generatorVersion = {
                    major: packet.generator_version.major,
                    minor: packet.generator_version.minor,
                    build: packet.generator_version.build,
                };
                this.#tags = packet.tags;
                this.#games = packet.games;
                this.#seed = packet.seed_name;
                this.#password = packet.password;
                this.#permissions = packet.permissions;
                this.#hintCost = packet.hint_cost;
                this.#locationCheckPoints = packet.location_check_points;
            })
            .on("connected", (packet) => {
                this.#locations = packet.missing_locations.length + packet.checked_locations.length;

                this.emit("hintPointsUpdated", [this.#hintPoints, packet.hint_points]);
                this.#hintPoints = packet.hint_points;
            })
            .on("roomUpdate", (packet) => {
                if (packet.hint_cost !== undefined) {
                    const [oc, op] = [this.hintCost, this.hintCostPercentage];
                    this.#hintCost = packet.hint_cost;
                    this.emit("hintCostUpdated", [oc, this.hintCost, op, this.hintCostPercentage]);
                }

                if (packet.hint_points !== undefined) {
                    const old = this.#hintPoints;
                    this.#hintPoints = packet.hint_points;
                    this.emit("hintPointsUpdated", [old, this.hintPoints]);
                }

                if (packet.location_check_points !== undefined) {
                    const old = this.#locationCheckPoints;
                    this.#locationCheckPoints = packet.location_check_points;
                    this.emit("locationCheckPointsUpdated", [old, this.locationCheckPoints]);
                }

                if (packet.password !== undefined) {
                    this.#password = packet.password;
                    this.emit("passwordUpdated", [this.password]);
                }

                if (packet.permissions !== undefined) {
                    const old = this.#permissions;
                    this.#permissions = packet.permissions;
                    this.emit("permissionsUpdated", [old, this.permissions]);
                }
            });
    }
}

/**
 * An interface with all supported room events and their respective callback arguments. To be called from
 * {@link RoomStateManager}.
 */
export type RoomStateEvents = {
    /**
     * Fires when the room password has been toggled.
     * @param password If the room now requires a password to join.
     */
    passwordUpdated: [password: boolean]

    /**
     * Fires when command permissions have been updated.
     * @param oldValue The previous command permissions table.
     * @param newValue The new command permissions table.
     */
    permissionsUpdated: [oldValue: PermissionTable, newValue: PermissionTable]

    /**
     * Fires when the location check points have been updated.
     * @param oldValue The previous location check points value.
     * @param newValue The new location check points value.
     */
    locationCheckPointsUpdated: [oldValue: number, newValue: number]

    /**
     * Fires when the hint cost has been updated.
     * @param oldCost The previous amount of hint points required to request a hint.
     * @param newCost The new amount of hint points required to request a hint.
     * @param oldPercentage The old hint cost percentage.
     * @param newPercentage The new hint cost percentage.
     */
    hintCostUpdated: [oldCost: number, newCost: number, oldPercentage: number, newPercentage: number]

    /**
     * Fires when the player's hint points value has updated.
     * @param oldValue The old hint point value.
     * @param newValue The new hint point value.
     */
    hintPointsUpdated: [oldValue: number, newValue: number]
};
