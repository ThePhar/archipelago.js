import { ServerPacketType } from "../enums/CommandPacketTypes.ts";
import { JSONSerializableData } from "../types/JSONSerializableData.ts";

/**
 * Sent to clients as a response to a {@link GetPacket}.
 *
 * Additional arguments added to the {@link GetPacket} that triggered this {@link RetrievedPacket} will also be passed
 * along.
 * @internal
 * @category Server Packets
 */
export interface RetrievedPacket {
    readonly cmd: ServerPacketType.Retrieved

    /** A key-value collection containing all the values for the keys requested in the {@link GetPacket}. */
    readonly keys: { [key: string]: JSONSerializableData }

    /** Additional arguments that were passed in from {@link GetPacket}. */
    readonly [p: string]: JSONSerializableData
}
