import { Permission, ServerPacketType } from "../../enums";
import { NetworkPlayer, NetworkVersion } from "../../structs";
import { ServerPacket } from "../index";

/**
 * Sent when there is a need to update information about the present game session. Generally useful for **async** games.
 * Once authenticated, this may also contain data from {@link ConnectedPacket}.
 *
 * All arguments for this packet are optional, only changes are sent.
 *
 * @category Server Packets
 */
export interface RoomUpdatePacket extends ServerPacket {
    cmd: ServerPacketType.ROOM_UPDATE;

    /** Number of hint points that the current player has. */
    hint_points?: number;

    /** Information on the players, whether connected or not. */
    players?: NetworkPlayer[];

    /**
     * Might be a partial update, containing new locations that were checked, especially from a co-op partner in the
     * same slot.
     */
    checked_locations?: number[];

    /** Object denoting the version of Archipelago which the server is running. */
    version?: NetworkVersion;

    /** Denotes special features or capabilities that the sender is capable of. Example: `WebHost` */
    tags?: string[];

    /** Denoted whether a password is required to join this room. */
    password?: boolean;

    /** Mapping of permission name to {@link Permission}, keys are: `release`, `collect` and `remaining`. */
    permissions?: {
        /**
         * Dictates what is allowed when it comes to a player releasing their run. A release is an action which
         * distributes the rest of the items in a player's run to those other players awaiting them.
         *
         * - {@link Permission.AUTO}: Distributes a player's items to other players when they complete their goal.
         * - {@link Permission.ENABLED}: Denotes that players may `!release` at any time in the game.
         * - {@link Permission.AUTO_ENABLED}: Both of the above options together.
         * - {@link Permission.DISABLED}: All release modes disabled.
         * - {@link Permission.GOAL}: Allows for manual use of `!release` command once a player completes their goal.
         * (Disabled until goal completion)
         */
        release: Permission;

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

    /** List of games present in this multiworld. */
    games?: string[];

    /**
     * Checksum hash of the individual games' data packages the server will send. Used by newer clients to decide which
     * games' caches are outdated. See {@link DataPackageObject} for more information on the data package.
     */
    datapackage_checksums?: { [game: string]: string };

    /** Uniquely identifying name of this generation. */
    seed_name?: string;

    /**
     * Unix time stamp of "now". Send for time synchronization if wanted for things like a DeathLink
     * {@link BouncePacket}.
     */
    time?: number;
}
