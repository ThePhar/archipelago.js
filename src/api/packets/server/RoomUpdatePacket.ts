import { PermissionTable } from "../../enums/Permission.ts";
import { NetworkPlayer } from "../../types/NetworkPlayer.ts";

/**
 * Sent when there is a need to update information about the present game session. Generally useful for **async** games.
 * Once authenticated, this may also contain data from {@link ConnectedPacket}.
 *
 * All arguments for this packet are optional, only changes are sent.
 * @category Server Packets
 */
export type RoomUpdatePacket = {
    readonly cmd: "RoomUpdate"

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

    /** Mapping of restrict-able commands to their current {@link Permission} level. */
    readonly permissions: PermissionTable

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
