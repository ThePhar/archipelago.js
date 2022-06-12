import { APBaseObject, APBasePacket } from "../__base";
import { NetworkPlayer } from "../NetworkPlayer";
import { NetworkSlot } from "../NetworkSlot";

export interface ConnectedPacket extends APBasePacket {
    readonly cmd: "Connected";
    readonly team: number;
    readonly slot: number;
    readonly players: NetworkPlayer[];
    readonly missing_locations: number[];
    readonly checked_locations: number[];
    readonly slot_data: APBaseObject;
    readonly slot_info: { [slot: number]: NetworkSlot };
}
