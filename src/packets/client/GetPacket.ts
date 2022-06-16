import { CommandPacketType } from "../../enums";
import { BasePacket } from "../index";

/**
 * Sent by the client to request a single or multiple values from the server's data storage, see the {@link SetPacket}
 * for how to write values to the data storage. A {@link GetPacket} will be answered with a {@link RetrievedPacket}.
 *
 * Additional properties sent in this package will also be added to the {@link RetrievedPacket} it triggers.
 *
 * @category Client Packets
 */
export interface GetPacket extends BasePacket {
    cmd: CommandPacketType.GET;

    /** Keys to retrieve the values for. */
    keys: string[];
}
