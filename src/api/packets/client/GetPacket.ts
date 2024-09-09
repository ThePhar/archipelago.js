import { JSONSerializableData } from "../../types/JSONSerializableData.ts";

/**
 * Sent by the client to request a single or multiple values from the server's data storage, see the {@link SetPacket}
 * for how to write values to the data storage. A {@link GetPacket} will be answered with a {@link RetrievedPacket}.
 *
 * Additional properties sent in this package will also be added to the {@link RetrievedPacket} it triggers.
 *
 * Some special read-only keys exist with specific return data:
 *
 * - `_read_hints_{team}_{slot}`: {@link NetworkHint}[] - All known {@link NetworkHint}s belonging to the requested
 * player.
 * - `_read_slot_data_{slot}`: {@link JSONSerializableData} - `slot_data` belonging to the requested slot.
 * - `_read_item_name_groups_{game}`: `Record<string, string[]>` - An object of item groups and their members.
 * - `_read_location_name_groups_{game}`: `Record<string, string[]>` - An object of location groups and their
 * members.
 * - `_read_client_status_{team}_{slot}`: {@link ClientStatus} - The current status of the requested player.
 * @category Client Packets
 */
export type GetPacket = {
    readonly cmd: "Get"

    /** Keys to retrieve the values for. */
    readonly keys: string[]

    /** Additional arguments to be returned in {@link RetrievedPacket}. */
    readonly [p: string]: JSONSerializableData
}
