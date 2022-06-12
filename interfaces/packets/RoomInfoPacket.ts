import { APBasePacket } from "../__base";
import { NetworkVersion } from "../NetworkVersion";
import { Permission } from "../../enums/Permission";
import { NetworkPlayer } from "../NetworkPlayer";

export interface RoomInfoPacket extends APBasePacket {
    readonly cmd: "RoomInfo";
    readonly version: NetworkVersion;
    readonly tags: string[];
    readonly password: boolean;
    readonly permissions: { [keys: string]: Permission };
    readonly hint_cost: number;
    readonly location_check_points: number;
    readonly players: NetworkPlayer[];
    readonly games: string[];
    readonly datapackage_version: number;
    readonly datapackage_versions: { [game: string]: number };
    readonly seed_name: string;
    readonly time: number;
}
