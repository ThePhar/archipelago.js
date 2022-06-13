import { BasePacket } from "@packets";

export class ConnectUpdatePacket implements BasePacket {
    readonly cmd = "ConnectUpdate";
    readonly items_handling: number;
    readonly tags: ReadonlyArray<string>;

    public constructor(itemsHandling: number, tags: string[]) {
        this.items_handling = itemsHandling;
        this.tags = tags;
    }
}
