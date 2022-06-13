import { CommandPacketType } from "@enums";
import { BasePacket } from "@packets";

export class ConnectUpdatePacket implements BasePacket {
    readonly cmd = CommandPacketType.CONNECT_UPDATE;
    readonly items_handling: number;
    readonly tags: ReadonlyArray<string>;

    public constructor(itemsHandling: number, tags: string[]) {
        this.items_handling = itemsHandling;
        this.tags = tags;
    }
}
