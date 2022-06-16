import { CommandPacketType, Permission } from "../../enums";
import { NetworkPlayer, NetworkVersion } from "../../structs";
import { BasePacket } from "../index";

/**
 * Sent when there is a need to update information about the present game session. Generally useful for **async** games.
 * Once authenticated, this may also contain data from {@link ConnectedPacket}.
 *
 * All arguments for this packet are optional, only changes are sent.
 *
 * @category Server Packets
 */
export interface RoomUpdatePacket extends BasePacket {
    cmd: CommandPacketType.ROOM_UPDATE;

    /** The client's current hint points. */
    hint_points?: number;

    /** Information on the players, whether connected or not. */
    players?: NetworkPlayer[];

    /**
     * May be a partial update, containing new locations that were checked, especially from a coop partner in the same
     * slot.
     */
    checked_locations?: number[];

    /**
     * Should never be sent as an update, if needed is the inverse of {@link RoomUpdatePacket.checked_locations}.
     */
    missing_locations?: number[];

    /** Object denoting the version of Archipelago which the server is running. */
    version?: NetworkVersion;

    /** Denotes special features or capabilities that the sender is capable of. Example: `WebHost` */
    tags?: string[];

    /** Denoted whether a password is required to join this room. */
    password?: boolean;

    /** Mapping of permission name to {@link Permission}, keys are: `forfeit`, `collect` and `remaining`. */
    permissions?: {
        /**
         * Dictates what is allowed when it comes to a player forfeiting their run. A forfeit is an action which
         * distributes the rest of the items in a player's run to those other players awaiting them.
         *
         * - {@link Permission.AUTO}: Distributes a player's items to other players when they complete their goal.
         * - {@link Permission.ENABLED}: Denotes that players may `!forfeit` at any time in the game.
         * - {@link Permission.AUTO_ENABLED}: Both of the above options together.
         * - {@link Permission.DISABLED}: All forfeit modes disabled.
         * - {@link Permission.GOAL}: Allows for manual use of `!forfeit` command once a player completes their goal.
         * (Disabled until goal completion)
         */
        forfeit: Permission;

        /**
         * Dictates what is allowed when it comes to a player collecting their run. A collect is an action which sends
         * the rest of the items in a player's run.
         *
         * - {@link Permission.AUTO}: Automatically when they complete their goal.
         * - {@link Permission.ENABLED}: Denotes that players may `!collect` at any time in the game.
         * - {@link Permission.AUTO_ENABLED}: Both of the above options together.
         * - {@link Permission.DISABLED}: All collect modes disabled.
         * - {@link Permission.GOAL}: Allows for manual use of `!collect` command once a player completes their goal.
         * (Disabled until goal completion)
         */
        collect: Permission;

        /**
         * Dictates what is allowed when it comes to a player querying the items remaining in their run.
         *
         * - {@link Permission.GOAL}: Allows a player to query for items remaining in their run but only after they
         * completed their own goal.
         * - {@link Permission.ENABLED}: Denotes that players may query for any items remaining in their run (even
         * those belonging to other players).
         * - {@link Permission.DISABLED}: All remaining item query modes disabled.
         */
        remaining: Permission;
    };

    /** The amount of points it costs to receive a hint from the server. */
    hint_cost?: number;

    /** The amount of hint points you receive per item/location check completed. */
    location_check_points?: number;

    /**
     * Sorted list of game names for the players, so first player's game will be `games[0]`. Matches game names in
     * the data package.
     */
    games?: string[];

    /**
     * Sum of individual games' data package version.
     *
     * Deprecated. Use {@link RoomInfoPacket.datapackage_versions} instead.
     *
     * @deprecated
     */
    datapackage_version?: number;

    /**
     * Data versions of the individual games' data packages the server will send. Used to decide which games' caches
     * are outdated. See {@link DataPackageObject} for more information on the data package.
     */
    datapackage_versions?: { [game: string]: number };

    /** Uniquely identifying name of this generation. */
    seed_name?: string;

    /**
     * Unix time stamp of "now". Send for time synchronization if wanted for things like a DeathLink
     * {@link BouncePacket}.
     */
    time?: number;
}
