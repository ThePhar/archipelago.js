import { BaseClientPacket } from "./BasePackets.ts";

/**
 * Sent by the client to request a single or multiple values from the server's data storage, see the {@link SetPacket}
 * for how to write values to the data storage. A {@link GetPacket} will be answered with a {@link RetrievedPacket}.
 *
 * Additional properties sent in this package will also be added to the {@link RetrievedPacket} it triggers.
 *
 * Some special keys exist with specific return data, all of them have the prefix `_read_`.
 * * `_read_hints_{team}_{slot}`: {@link Hint}[] - All known {@link Hint}s belonging to the requested player.
 * * `_read_slot_data_{slot}`: {@link JSONSerializableData} - `slot_data` belonging to the requested slot.
 *
 * @category Client Packets
 */
export interface GetPacket extends BaseClientPacket {
    cmd: "Get";

    /** Keys to retrieve the values for. */
    keys: string[];
}
