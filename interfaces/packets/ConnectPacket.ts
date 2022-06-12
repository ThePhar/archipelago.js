import { APBasePacket } from "../__base";
import { NetworkVersion } from "../NetworkVersion";
import { CommonTags } from "../../enums/CommonTags";
import { ItemsHandlingFlags } from "../../enums/ItemsHandlingFlags";

export interface ConnectPacket extends APBasePacket {
    readonly cmd: "Connect";
    readonly password: string;
    readonly game: string;
    readonly name: string;
    readonly uuid: string;
    readonly version: NetworkVersion;
    readonly items_handling: ItemsHandlingFlags | number;
    readonly tags: CommonTags | string;
}
