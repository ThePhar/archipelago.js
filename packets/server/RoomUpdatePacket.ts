import { Permission } from "@enums";
import { BasePacket } from "@packets";
import { NetworkPlayer, NetworkVersion } from "@structs";

export interface RoomUpdatePacket extends BasePacket {
    readonly cmd: "RoomUpdate";
    readonly hint_points?: number;
    readonly players?: NetworkPlayer[];
    readonly checked_locations?: number[];
    readonly missing_locations?: number[];
    readonly version?: NetworkVersion;
    readonly tags?: string[];
    readonly password?: boolean;
    readonly permissions?: { [keys: string]: Permission };
    readonly hint_cost?: number;
    readonly location_check_points?: number;
    readonly games?: string[];
    readonly datapackage_version?: number;
    readonly datapackage_versions?: { [game: string]: number };
    readonly seed_name?: string;
    readonly time?: number;
}
