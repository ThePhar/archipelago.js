import { CommandPacketType } from "@enums";
import { BasePacket } from "@packets";
import { APBaseObject, NetworkPlayer, NetworkSlot } from "@structs";

export interface ConnectedPacket extends BasePacket {
    readonly cmd: CommandPacketType.CONNECTED;
    readonly team: number;
    readonly slot: number;
    readonly players: NetworkPlayer[];
    readonly missing_locations: number[];
    readonly checked_locations: number[];
    readonly slot_data: APBaseObject;
    readonly slot_info: { [slot: number]: NetworkSlot };
}
