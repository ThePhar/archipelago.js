import { ServerPacketType } from "../enums/CommandPacketTypes.ts";
import { AutoPermission, Permission } from "../enums/Permission.ts";
import { NetworkPlayer } from "../types/NetworkPlayer.ts";

/**
 * Sent when there is a need to update information about the present game session. Generally useful for **async** games.
 * Once authenticated, this may also contain data from {@link ConnectedPacket}.
 *
 * All arguments for this packet are optional, only changes are sent.
 * @internal
 * @category Server Packets
 */
export interface RoomUpdatePacket {
    readonly cmd: ServerPacketType.RoomUpdate

    /** Number of hint points that the current player has. */
    readonly hint_points?: number

    /** Information on the players, whether connected or not. */
    readonly players?: NetworkPlayer[]

    /**
     * Might be a partial update, containing new locations that were checked, especially from a co-op partner in the
     * same slot.
     */
    readonly checked_locations?: number[]

    /** Denotes special features or capabilities that the sender is capable of. Example: `WebHost` */
    readonly tags?: string[]

    /** Denoted whether a password is required to join this room. */
    readonly password?: boolean

    /** Mapping of permission name to {@link Permission}, keys are: `release`, `collect` and `remaining`. */
    readonly permissions?: {
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
    readonly hint_cost?: number

    /** The amount of hint points you receive per item/location check completed. */
    readonly location_check_points?: number

    /**
     * Unix time stamp of "now". Send for time synchronization if wanted for things like a DeathLink
     * {@link BouncePacket}.
     */
    readonly time?: number
}
