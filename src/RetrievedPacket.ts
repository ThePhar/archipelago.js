import { APType } from "./APTypes.ts";
import { ServerPacket } from "./BasePacket.ts";
import { ServerPacketType } from "./CommandPacketType.ts";

/**
 * Sent to clients as a response to a {@link GetPacket}.
 *
 * Additional arguments added to the {@link GetPacket} that triggered this {@link RetrievedPacket} will also be passed
 * along.
 *
 * @category Server Packets
 */
export interface RetrievedPacket extends ServerPacket {
    cmd: ServerPacketType.RETRIEVED;

    /** A key-value collection containing all the values for the keys requested in the {@link GetPacket}. */
    keys: { [key: string]: APType };
}
