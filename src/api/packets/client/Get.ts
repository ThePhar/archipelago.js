import { JSONSerializable } from "../../types.ts";

/**
 * Sent by the client to request a single or multiple values from the server's data storage, see the {@link SetPacket}
 * for how to write values to the data storage. A {@link GetPacket} will be answered with a {@link RetrievedPacket}.
 *
 * Additional properties sent in this package will also be added to the {@link RetrievedPacket} it triggers.
 *
 * Some special read-only keys exist with specific return data:
 *
 * - `_read_hints_{team}_{slot}`: {@link NetworkHint}[] - All hinted {@link NetworkHint} items relevant to the requested
 * player.
 * - `_read_slot_data_{slot}`: {@link JSONSerializable} - `slot_data` belonging to the requested slot.
 * - `_read_item_name_groups_{game}`: `Record<string, string[]>` - An object of item groups and their members.
 * - `_read_location_name_groups_{game}`: `Record<string, string[]>` - An object of location groups and their
 * members.
 * - `_read_client_status_{team}_{slot}`: `number` - The current status for the requested player. See
 * {@link clientStatuses} for all known client statues.
 * - `_read_race_mode`: `number` - Returns `0` if race mode is disabled, `1` if it's enabled.
 * @category Network Packets
 */
export interface GetPacket {
    readonly cmd: "Get"

    /** Keys to retrieve the values for. */
    readonly keys: string[]

    /** Additional arguments to be returned in {@link RetrievedPacket}. */
    readonly [p: string]: JSONSerializable
}
