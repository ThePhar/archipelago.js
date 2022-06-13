import { randomUUID } from "crypto";
import { APBasePacket, NetworkVersion } from "..";
import { ItemsHandlingFlags } from "../../enums/ItemsHandlingFlags";

export class ConnectPacket implements APBasePacket {
    public readonly cmd = "Connect";
    public readonly uuid: string;
    public readonly game: string;
    public readonly name: string;
    public readonly password: string;
    public readonly version: NetworkVersion;
    public readonly tags: ReadonlyArray<string>;
    public readonly items_handling: number;

    public constructor(
        game: string,
        name: string,
        password: string,
        version: NetworkVersion,
        tags?: string[],
        itemsHandling?: number,
    ) {
        // Generate a random uuid.
        this.uuid = randomUUID();

        this.game = game;
        this.name = name;
        this.password = password;
        this.version = version;
        this.items_handling = itemsHandling ?? ItemsHandlingFlags.FULLY_REMOTE;
        this.tags = tags ?? [];
    }
}
