import { NetworkSlot, Permission, PermissionTable } from "../api";
import { ArchipelagoClient } from "../structs/ArchipelagoClient.ts";
import { APEventUnsubscribe } from "../utils.ts";

/**
 * Keeps track of room state.
 */
export class RoomManager {
    readonly #client: ArchipelagoClient;
    #serverVersion = { major: -1, minor: -1, build: -1 };
    #generatorVersion = { major: -1, minor: -1, build: -1 };
    #games: string[] = [];
    #seed: string = "";
    #locations: number = 0;
    #hasPassword: boolean = false;
    #hintCostPercentage: number = 0;
    #hintPoints: number = 0;
    #locationCheckPoints: number = 0;
    #serverTags: string[] = [];
    #releasePermission: Permission = 0;
    #collectPermission: Permission = 0;
    #remainingPermission: Permission = 0;
    #slots: Record<number, NetworkSlot> = {};

    /**
     * Instantiates a new RoomManager.
     * @internal
     * @param client The Archipelago client associated with this manager.
     */
    public constructor(client: ArchipelagoClient) {
        this.#client = client;

        this.#client.api.subscribe("onRoomInfo", (packet) => {
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
            this.#serverTags = packet.tags;
            this.#hasPassword = packet.password;
            this.#releasePermission = packet.permissions.release;
            this.#collectPermission = packet.permissions.collect;
            this.#releasePermission = packet.permissions.remaining;
            this.#hintCostPercentage = packet.hint_cost;
            this.#locationCheckPoints = packet.location_check_points;
            this.#games = packet.games;
            this.#seed = packet.seed_name;
        });

        this.#client.api.subscribe("onConnected", (packet) => {
            this.#hintPoints = packet.hint_points;
            this.#locations = packet.missing_locations.length + packet.checked_locations.length;
            this.#slots = packet.slot_info;
        });

        this.#client.api.subscribe("onRoomUpdate", (packet) => {
            this.#hintCostPercentage = packet.hint_cost ?? this.#hintCostPercentage;
            this.#hintPoints = packet.hint_points ?? this.#hintPoints;
            this.#locationCheckPoints = packet.location_check_points ?? this.#locationCheckPoints;
            this.#serverTags = packet.tags ?? this.#serverTags;
            this.#hasPassword = packet.password ?? this.#hasPassword;
            if (packet.permissions) {
                this.#releasePermission = packet.permissions.release;
                this.#collectPermission = packet.permissions.collect;
                this.#releasePermission = packet.permissions.remaining;
            }
        });
    }

    /**
     * Returns a record of basic information for each slot.
     * @remarks Slot information is shared across each team. For accessing player data, see {@link PlayersManager}.
     */
    public get slots(): Record<number, NetworkSlot> {
        return structuredClone(this.#slots);
    }

    /**
     * Returns the version of Archipelago the server is currently running.
     * @remarks All properties will be `-1` prior to initial connection.
     */
    public get serverVersion(): { major: number, minor: number, build: number } {
        // Return a shallow copy to prevent runtime modification of private field outside this library.
        return structuredClone(this.#serverVersion);
    }

    /**
     * Returns the version of Archipelago the seed was generated on.
     * @remarks All properties will be `-1` prior to initial connection.
     */
    public get generatorVersion(): { major: number, minor: number, build: number } {
        // Return a shallow copy to prevent runtime modification of private field outside this library.
        return structuredClone(this.#generatorVersion);
    }

    /** Returns a list of tags the server is currently capable of. */
    public get serverTags(): string[] {
        // Return a copy to prevent runtime modification of private field outside this library.
        return structuredClone(this.#serverTags);
    }

    /** Returns `true` if the room requires a password to join. */
    public get hasPassword(): boolean {
        return this.#hasPassword;
    }

    /**
     * Returns the string representation of the `!release` command option.
     * @remarks If the bit representation is required, use `permissionBitflags` property instead.
     */
    public get releaseMode(): "enabled" | "disabled" | "goal" | "auto" | "auto_enabled" {
        switch (this.#releasePermission) {
            case Permission.Auto:
                return "auto";
            case Permission.AutoEnabled:
                return "auto_enabled";
            case Permission.Disabled:
                return "disabled";
            case Permission.Enabled:
                return "enabled";
            case Permission.Goal:
                return "goal";
        }
    }

    /**
     * Returns the string representation of the `!collect` command option.
     * @remarks If the bit representation is required, use `permissionBitflags` property instead.
     */
    public get collectMode(): "enabled" | "disabled" | "goal" | "auto" | "auto_enabled" {
        switch (this.#collectPermission) {
            case Permission.Auto:
                return "auto";
            case Permission.AutoEnabled:
                return "auto_enabled";
            case Permission.Disabled:
                return "disabled";
            case Permission.Enabled:
                return "enabled";
            case Permission.Goal:
                return "goal";
        }
    }

    /**
     * Returns the string representation of the `!remaining` command option.
     * @remarks If the bit representation is required, use `permissionBitflags` property instead.
     */
    public get remainingMode(): "enabled" | "disabled" | "goal" {
        switch (this.#remainingPermission) {
            case Permission.Disabled:
                return "disabled";
            case Permission.Enabled:
                return "enabled";
            case Permission.Goal:
                return "goal";
            default:
                // Ideally this should never happen, but alas.
                throw new Error(`Invalid remaining permission: ${this.#remainingPermission}`);
        }
    }

    /**
     * Returns the current room permission bitflag table.
     * @returns An object with bitflag values for each command, matching what the network protocol provides.
     * @remarks For a string representation of each permission, use `releaseMode`, `collectMode`, and `remainingMode`
     * properties instead.
     */
    public get permissionBitflags(): PermissionTable {
        return {
            release: this.#releasePermission,
            collect: this.#collectPermission,
            remaining: this.#remainingPermission,
        };
    }

    /** Returns the percentage of locations that need to be checked to have enough points to hint from the server. */
    public get hintCostPercentage(): number {
        return this.#hintCostPercentage;
    }

    /** Returns the amount of hint points this player needs to create a hint. */
    public get hintCost(): number {
        if (this.#hintCostPercentage) {
            return Math.max(1, Math.floor(this.#hintCostPercentage * this.#locations * 0.01));
        }

        return 0;
    }

    /** Returns the amount of hint points this player currently has. */
    public get hintPoints(): number {
        return this.#hintPoints;
    }

    /** Returns the amount of hint points received per location checked. */
    public get locationCheckPoints(): number {
        return this.#locationCheckPoints;
    }

    /** Returns the list of games present in the current room. */
    public get games(): string[] {
        return structuredClone(this.#games);
    }

    /**
     * Get the seed name for this room.
     * @remarks Based on the seed to generate this multi-world, but not exactly the same to prevent reverse engineering.
     */
    public get seedName(): string {
        return this.#seed;
    }

    /**
     * Register a callback to fire when the room state changes.
     * @param callback The callback to fire when the room state changes.
     * @returns An unsubscribe function to remove the event listener when no longer needed.
     * @example
     * client.room.onRoomUpdate((changes) => {
     *     if (changes.hintPointsChanged) {
     *         console.log(`You now have ${client.room.hintPoints} hint points!`);
     *     }
     *
     *     if (changes.hintCostChanged) {
     *         console.log(`New hints now cost ${client.room.hintCost} hint points.`);
     *     }
     * });
     */
    public onRoomUpdate(callback: (changes: ChangedRoomProperties) => void): APEventUnsubscribe {
        return this.#client.api.subscribe("onRoomUpdate", (packet) => {
            const changes: ChangedRoomProperties = {
                // Any time this is present, we'll treat it as different.
                serverTagsChanged: packet.tags !== undefined,
                hintPointsChanged: packet.hint_points !== undefined,
                hintCostChanged: packet.hint_cost !== undefined,
                locationCheckPointsChanged: packet.location_check_points !== undefined,
                hasPasswordChanged: packet.password !== undefined,
                permissionsChanged: packet.permissions !== undefined,
            };

            callback(changes);
        });
    }
}

/**
 * An object containing the possible values that can change when room state updates. Returned on the callback from
 * {@link RoomManager.onRoomUpdate}.
 */
export type ChangedRoomProperties = {
    readonly hasPasswordChanged: boolean
    readonly permissionsChanged: boolean
    readonly hintPointsChanged: boolean
    readonly hintCostChanged: boolean
    readonly locationCheckPointsChanged: boolean
    readonly serverTagsChanged: boolean
};
