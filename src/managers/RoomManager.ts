import { AutoPermission, Permission } from "../api/index.ts";
import { ArchipelagoClient } from "../ArchipelagoClient.ts";

/**
 * Manages room data such as room settings, containing games, data packages, etc.
 */
export class RoomManager {
    #client: ArchipelagoClient;
    #serverVersion = { major: -1, minor: -1, build: -1 };
    #generatorVersion = { major: -1, minor: -1, build: -1 };
    #serverTags: string[] = [];
    #password: boolean = false;
    #hintCost: number = 0;
    #locationCheckPoints: number = 0;
    #games: string[] = [];
    #seed: string = "";
    #permissions: {
        release: AutoPermission | number
        collect: AutoPermission | number
        remaining: Permission | number
    } = { release: AutoPermission.Disabled, collect: AutoPermission.Disabled, remaining: Permission.Disabled };

    /**
     * Creates a new RoomManager.
     * @internal
     * @param client The {@link ArchipelagoClient} object this object is attached to.
     */
    public constructor(client: ArchipelagoClient) {
        this.#client = client;
        this.#initializeFields();

        // If a disconnection event happens, reset all fields.
        this.#client.socket.subscribe("onDisconnected", () => {
            this.#initializeFields();
        });

        // Update fields based on room info.
        this.#client.socket.subscribe("onRoomInfo", (packet) => {
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
    }

    /**
     * Get the version of Archipelago the server is currently running.
     * @returns The Archipelago version on the server.
     * @remarks All properties will be `-1` if not currently connected.
     */
    public get serverVersion(): { major: number, minor: number, build: number } {
        // Return a shallow copy to prevent runtime modification of private field outside this library.
        return { ...this.#serverVersion };
    }

    /**
     * Get the version of Archipelago the seed was generated on.
     * @returns The Archipelago version used to generate this room's seed.
     * @remarks All properties will be `-1` if not currently connected.
     */
    public get generatorVersion(): { major: number, minor: number, build: number } {
        // Return a shallow copy to prevent runtime modification of private field outside this library.
        return { ...this.#generatorVersion };
    }

    /**
     * Get a list of tags the server is currently capable of.
     * @returns List of tags listing features or capabilities the server currently has.
     */
    public get serverTags(): string[] {
        // Return a copy to prevent runtime modification of private field outside this library.
        return [...this.#serverTags];
    }

    /**
     * Determines if the room requires a password to authenticate and join.
     * @returns `true` if the room requires a password to join.
     */
    public get password(): boolean {
        return this.#password;
    }

    /**
     * Get the current room permission of the `!release` command.
     * @returns The string representation of the current release option.
     * @remarks If the bit representation is required, use `permissionBitflags` property instead.
     */
    public get releaseMode(): "enabled" | "disabled" | "goal" | "auto" | "auto_enabled" | "unknown" {
        switch (this.#permissions.release) {
            case AutoPermission.Auto:
                return "auto";
            case AutoPermission.AutoEnabled:
                return "auto_enabled";
            case AutoPermission.Disabled:
                return "disabled";
            case AutoPermission.Enabled:
                return "enabled";
            case AutoPermission.Goal:
                return "goal";
            default:
                console.warn(`[Archipelago] Unknown release permission mode: ${this.#permissions.release}`);
                return "unknown";
        }
    }

    /**
     * Get the current room permission of the `!collect` command.
     * @returns The string representation of the current collect option.
     * @remarks If the bit representation is required, use `permissionBitflags` property instead.
     */
    public get collectMode(): "enabled" | "disabled" | "goal" | "auto" | "auto_enabled" | "unknown" {
        switch (this.#permissions.collect) {
            case AutoPermission.Auto:
                return "auto";
            case AutoPermission.AutoEnabled:
                return "auto_enabled";
            case AutoPermission.Disabled:
                return "disabled";
            case AutoPermission.Enabled:
                return "enabled";
            case AutoPermission.Goal:
                return "goal";
            default:
                console.warn(`[Archipelago] Unknown collect permission mode: ${this.#permissions.collect}`);
                return "unknown";
        }
    }

    /**
     * Get the current room permission of the `!remaining` command.
     * @returns The string representation of the current remaining option.
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
                console.warn(`[Archipelago] Unknown remaining permission mode: ${this.#permissions.remaining}`);
                return "unknown";
        }
    }

    /**
     * Get the current room permission bitflag table.
     * @returns An object with bitflag values for each command, matching what the network protocol provides.
     * @remarks For a string representation of each permission, use `releaseMode`, `collectMode`, and `remainingMode`
     * properties instead.
     */
    public get permissionBitflags(): { release: AutoPermission, collect: AutoPermission, remaining: Permission } {
        return { ...this.#permissions };
    }

    /**
     * Get the amount of hint points required to request a hint from the server.
     * @returns Number of hint points required to hint an item or location.
     */
    public get hintCost(): number {
        return this.#hintCost;
    }

    /**
     * Get the amount of hint points received per location checked.
     * @returns Number of hint points received per location checked.
     */
    public get locationCheckPoints(): number {
        return this.#locationCheckPoints;
    }

    /**
     * Get the list of games present in the current room.
     * @returns List of games present in this room.
     */
    public get games(): string[] {
        return [...this.#games];
    }

    /**
     * Get the seed name for this room.
     * @returns The seed name for this room.
     * @remarks Based on the seed to generate this multi-world, but not exactly the same to prevent reverse engineering.
     */
    public get seedName(): string {
        return this.#seed;
    }

    #initializeFields(): void {
        this.#serverVersion = { major: -1, minor: -1, build: -1 };
        this.#generatorVersion = { major: -1, minor: -1, build: -1 };
        this.#serverTags = [];
        this.#password = false;
        this.#hintCost = 0;
        this.#locationCheckPoints = 0;
        this.#games = [];
        this.#seed = "";
        this.#permissions = {
            release: AutoPermission.Disabled,
            collect: AutoPermission.Disabled,
            remaining: Permission.Disabled,
        };
    }
}
