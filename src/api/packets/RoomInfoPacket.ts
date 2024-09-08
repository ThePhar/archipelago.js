import { ServerPacketType } from "../enums/CommandPacketTypes";
import { AutoPermission, Permission } from "../enums/Permission";
import { NetworkVersion } from "../types/NetworkVersion";

/**
 * Sent to clients when they connect to an Archipelago server, but before they authenticate.
 * @internal
 * @category Server Packets
 */
export interface RoomInfoPacket {
    readonly cmd: ServerPacketType.RoomInfo

    /** Object denoting the version of Archipelago which the server is running. */
    readonly version: NetworkVersion

    /** Object denoting the version of Archipelago which generated the multi-world. */
    readonly generator_version: NetworkVersion

    /** Denotes special features or capabilities that the sender is capable of. Example: `WebHost` */
    readonly tags: string[]

    /** Denoted whether a password is required to join this room. */
    readonly password: boolean

    /** Mapping of permission name to {@link Permission}, keys are: `release`, `collect` and `remaining`. */
    readonly permissions: {
        /**
         * Dictates what is allowed when it comes to a player releasing their run. A release is an action which
         * distributes the rest of the items in a player's run to those other players awaiting them.
         *
         * - {@link AutoPermission.Auto}: Distributes a player's items to other players when they complete their goal.
         * - {@link AutoPermission.Enabled}: Denotes that players may `!release` at any time in the game.
         * - {@link AutoPermission.AutoEnabled}: Both of the above options together.
         * - {@link AutoPermission.Disabled}: All forfeit modes disabled.
         * - {@link AutoPermission.Goal}: Allows for manual use of `!release` command once a player completes their
         * goal (disabled until goal completion).
         */
        readonly release: AutoPermission

        /**
         * Dictates what is allowed when it comes to a player collecting their run. A collect is an action which sends
         * the rest of the items in a player's run.
         *
         * - {@link AutoPermission.Auto}: Automatically when they complete their goal.
         * - {@link AutoPermission.Enabled}: Denotes that players may `!collect` at any time in the game.
         * - {@link AutoPermission.AutoEnabled}: Both of the above options together.
         * - {@link AutoPermission.Disabled}: All collect modes disabled.
         * - {@link AutoPermission.Goal}: Allows for manual use of `!collect` command once a player completes their
         * goal (disabled until goal completion).
         */
        readonly collect: AutoPermission

        /**
         * Dictates what is allowed when it comes to a player querying the items remaining in their run.
         *
         * - {@link Permission.Goal}: Allows a player to query for items remaining in their run but only after they
         * completed their own goal.
         * - {@link Permission.Enabled}: Denotes that players may query for any items remaining in their run (even
         * those belonging to other players).
         * - {@link Permission.Disabled}: All remaining item query modes disabled.
         */
        readonly remaining: Permission
    }

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
}
