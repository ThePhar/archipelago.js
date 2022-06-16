import { CommandPacketType } from "../../enums";
import { BasePacket } from "../index";

/**
 * Sent by the client to inform the server of locations the client has seen, but not checked. Useful in cases in which
 * the item may appear in the game world, such as 'ledge items' in `A Link to the Past`. The server will always respond
 * with a {@link LocationInfoPacket} with the items located in the scouted location.
 *
 * @category Client Packets
 */
export interface LocationScoutsPacket extends BasePacket {
    cmd: CommandPacketType.LOCATION_SCOUTS;

    /**
     * The ids of the locations seen by the client. May contain any number of locations, even ones sent before;
     * duplicates do not cause issues with the Archipelago server.
     */
    locations: number[];

    /** If `true`, the scouted locations get created and broadcast as a player-visible hint. */
    create_as_hint: boolean;
}
