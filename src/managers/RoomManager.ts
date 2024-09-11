import { Permission, PermissionTable } from "../api";
import { ArchipelagoClient } from "../structs/ArchipelagoClient.ts";

/**
 * Keeps track of room state.
 */
export class RoomManager {
    readonly #client: ArchipelagoClient;
    #serverVersion = { major: -1, minor: -1, build: -1 };
    #generatorVersion = { major: -1, minor: -1, build: -1 };
    #serverTags: string[] = [];
    #password: boolean = false;
    #hintCost: number = 0;
    #locationCheckPoints: number = 0;
    #games: string[] = [];
    #seed: string = "";
    #permissions: PermissionTable = {
        release: Permission.Disabled,
        collect: Permission.Disabled,
        remaining: Permission.Disabled,
    };

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
            this.#password = packet.password;
            this.#permissions = packet.permissions;
            this.#hintCost = packet.hint_cost;
            this.#locationCheckPoints = packet.location_check_points;
            this.#games = packet.games;
            this.#seed = packet.seed_name;
        });

        this.#client.api.subscribe("onRoomUpdate", (packet) => {
            this.#hintCost = packet.hint_cost ?? this.#hintCost;
            this.#locationCheckPoints = packet.location_check_points ?? this.#locationCheckPoints;
            this.#permissions = packet.permissions ?? this.#permissions;
            this.#serverTags = packet.tags ?? this.#serverTags;
            this.#password = packet.password ?? this.#password;
        });
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
        return [...this.#serverTags];
    }

    /**
     * Returns if the room requires a password to authenticate and join.
     * @returns `true` if the room requires a password to join.
     */
    public get password(): boolean {
        return this.#password;
    }

    /**
     * Returns a string representation of the current permissions for the `!release` command.
     * @remarks If the bit representation is required, use `permissionBitflags` property instead.
     */
    public get releaseMode(): "enabled" | "disabled" | "goal" | "auto" | "auto_enabled" | "unknown" {
        switch (this.#permissions.release) {
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
            default:
                return "unknown";
        }
    }

    /**
     * Returns a string representation of the current permissions for the `!collect` command.
     * @remarks If the bit representation is required, use `permissionBitflags` property instead.
     */
    public get collectMode(): "enabled" | "disabled" | "goal" | "auto" | "auto_enabled" | "unknown" {
        switch (this.#permissions.collect) {
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
            default:
                return "unknown";
        }
    }

    /**
     * Returns a string representation of the current permissions for the `!remaining` command.
     * @remarks If the bit representation is required, use `permissionBitflags` property instead.
     */
    public get remainingMode(): "enabled" | "disabled" | "goal" | "unknown" {
        switch (this.#permissions.remaining) {
            case Permission.Disabled:
                return "disabled";
            case Permission.Enabled:
                return "enabled";
            case Permission.Goal:
                return "goal";
            default:
                return "unknown";
        }
    }

    /**
     * Returns the current room permission bitflag table.
     * @returns An object with bitflag values for each command, matching what the network protocol provides.
     * @remarks For a string representation of each permission, use `releaseMode`, `collectMode`, and `remainingMode`
     * properties instead.
     */
    public get permissionBitflags(): PermissionTable {
        return structuredClone(this.#permissions);
    }

    /** Returns the amount of hint points required to request a hint from the server. */
    public get hintCost(): number {
        return this.#hintCost;
    }

    /** Returns the amount of hint points received per location checked. */
    public get locationCheckPoints(): number {
        return this.#locationCheckPoints;
    }

    /** Returns the list of games present in the current room. */
    public get games(): string[] {
        return [...this.#games];
    }

    /**
     * Get the seed name for this room.
     * @remarks Based on the seed to generate this multi-world, but not exactly the same to prevent reverse engineering.
     */
    public get seedName(): string {
        return this.#seed;
    }
}
