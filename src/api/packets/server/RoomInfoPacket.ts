import { PermissionTable } from "../../enums/Permission.ts";
import { NetworkVersion } from "../../types/NetworkVersion.ts";

/**
 * Sent to clients when they connect to an Archipelago server, but before they authenticate.
 * @category Server Packets
 */
export type RoomInfoPacket = {
    readonly cmd: "RoomInfo"

    /** Object denoting the version of Archipelago which the server is running. */
    readonly version: NetworkVersion

    /** Object denoting the version of Archipelago which generated the multi-world. */
    readonly generator_version: NetworkVersion

    /** Denotes special features or capabilities that the sender is capable of. Example: `WebHost` */
    readonly tags: string[]

    /** Denoted whether a password is required to join this room. */
    readonly password: boolean

    /** Mapping of restrict-able commands to their current {@link Permission} level. */
    readonly permissions: PermissionTable

    /** The amount of points it costs to receive a hint from the server. */
    readonly hint_cost: number

    /** The amount of hint points you receive per item/location check completed. */
    readonly location_check_points: number

    /** List of games present in this multi-world. */
    readonly games: string[]

    /**
     * Checksum hash of the individual games' data packages the server will send. Used by newer clients to decide which
     * games' caches are outdated. See {@link DataPackage} for more information on the data package.
     */
    readonly datapackage_checksums: { [game: string]: string }

    /** Uniquely identifying name for this generation. Based on the `seed`, but not identical to prevent spoilers. */
    readonly seed_name: string

    /**
     * Unix time stamp in seconds of "now". Sent for time synchronization if wanted for things like a DeathLink
     * {@link BouncePacket}.
     */
    readonly time: number
};
