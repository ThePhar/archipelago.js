import { APBasePacket } from "../__base";
import { ItemsHandlingFlags } from "../../enums/ItemsHandlingFlags";

export interface ConnectUpdatePacket extends APBasePacket {
    readonly cmd: "ConnectUpdate";
    readonly items_handling: ItemsHandlingFlags | number;
    readonly tags: string[];
}
