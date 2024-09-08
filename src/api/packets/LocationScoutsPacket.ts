import { CreateAsHintMode } from "../enums/CreateAsHintMode";
import { ClientPacketType } from "../enums/CommandPacketTypes";

/**
 * Sent by the client to inform the server of locations the client has seen, but not checked. Useful in cases in which
 * the item may appear in the game world, but may not be immediately gettable. The server will always respond with a
 * {@link LocationInfoPacket} with the items located in the scouted location.
 * @internal
 * @category Client Packets
 */
export interface LocationScoutsPacket {
    readonly cmd: ClientPacketType.LocationScouts

    /**
     * The ids of the locations seen by the client. May contain any number of locations, even ones sent before;
     * duplicates do not cause issues with the Archipelago server.
     */
    readonly locations: number[]

    /**
     * If non-zero, the scouted locations get created and broadcast as a player-visible hint. See
     * {@link CreateAsHintMode} for more information.
     */
    readonly create_as_hint: CreateAsHintMode
}
