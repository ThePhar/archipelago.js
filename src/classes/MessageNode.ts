import {
    ColorJSONMessagePart,
    ItemJSONMessagePart,
    JSONMessagePart,
    LocationJSONMessagePart,
    NetworkItem,
    TextJSONMessagePart,
    ValidJSONColorType,
} from "../api";
import { Client } from "./Client.ts";
import { Item } from "./Item.ts";
import { PackageMetadata } from "./PackageMetadata.ts";
import { Player } from "./Player.ts";

/**
 * The base class for all message node objects.
 */
export abstract class BaseMessageNode {
    /** The client object containing additional context metadata. */
    protected readonly client: Client;

    /** The underlying message part component. */
    protected readonly part: JSONMessagePart;

    /** The type of this message node. */
    public readonly abstract type: string;

    /**
     * Instantiates a new message node object.
     * @internal
     * @param client The client object containing additional context metadata for this node.
     * @param part The underlying message part component from the network protocol.
     * @protected
     */
    protected constructor(client: Client, part: JSONMessagePart) {
        this.client = client;
        this.part = part;
    }

    /**
     * Returns the plaintext component of this message node.
     * @remarks Same value returned from `.toString()`.
     */
    public abstract get text(): string;

    /** Returns the plaintext component of this message node. */
    public toString(): string {
        return this.text;
    };
}

/**
 * A message node object containing item metadata.
 */
export class ItemMessageNode extends BaseMessageNode {
    protected override readonly part: ItemJSONMessagePart;
    public readonly type = "item" as const;

    /** The item this node is referring to. */
    public readonly item: Item;

    /**
     * Instantiates a new message node object.
     * @internal
     * @param client The client object containing additional context metadata for this node.
     * @param part The underlying message part component from the network protocol.
     * @param item The network item in reference to this message node.
     * @param receiver The player to receive this item.
     */
    public constructor(client: Client, part: ItemJSONMessagePart, item: NetworkItem, receiver: Player) {
        super(client, part);

        const player = client.players.findPlayer(part.player, receiver.team) as Player;
        this.part = part;
        this.item = new Item(client, item, player, receiver);
    }

    /** Returns the name of this item. */
    public get text(): string {
        return this.item.name;
    }
}

/**
 * A message node object containing location metadata.
 */
export class LocationMessageNode extends BaseMessageNode {
    readonly #name: string;

    protected override readonly part: LocationJSONMessagePart;
    public readonly type = "location" as const;

    /** The integer id of this location. */
    public readonly id: number;

    /**
     * Instantiates a new message node object.
     * @internal
     * @param client The client object containing additional context metadata for this node.
     * @param part The underlying message part component from the network protocol.
     */
    public constructor(client: Client, part: LocationJSONMessagePart) {
        super(client, part);

        const player = client.players.findPlayer(part.player) as Player;
        const pkg = client.package.findPackage(player.game) as PackageMetadata;
        this.part = part;
        if (part.type === "location_name") {
            this.#name = part.text;
            this.id = pkg.locationTable[part.text];
        } else {
            this.id = parseInt(part.text);
            this.#name = client.package.lookupLocationName(player.game, this.id, true);
        }
    }

    /** Returns the name of this location. */
    public get text(): string {
        return this.#name;
    }
}

/**
 * A message node object containing explicit color metadata.
 */
export class ColorMessageNode extends BaseMessageNode {
    protected override readonly part: ColorJSONMessagePart;
    public readonly type = "color" as const;

    /** The explicit color (or style) of this node. */
    public readonly color: ValidJSONColorType;

    /**
     * Instantiates a new message node object.
     * @internal
     * @param client The client object containing additional context metadata for this node.
     * @param part The underlying message part component from the network protocol.
     */
    public constructor(client: Client, part: ColorJSONMessagePart) {
        super(client, part);

        this.part = part;
        this.color = part.color;
    }

    public get text(): string {
        return this.part.text;
    }
}

/**
 * A message node object containing explicit color metadata.
 */
export class TextualMessageNode extends BaseMessageNode {
    protected override readonly part: TextJSONMessagePart;
    public readonly type: "text" | "entrance";

    /**
     * Instantiates a new message node object.
     * @internal
     * @param client The client object containing additional context metadata for this node.
     * @param part The underlying message part component from the network protocol.
     */
    public constructor(client: Client, part: TextJSONMessagePart) {
        super(client, part);

        this.part = part;
        if (this.part.type === "entrance_name") {
            this.type = "entrance";
        } else {
            this.type = "text";
        }
    }

    public get text(): string {
        return this.part.text;
    }
}

/**
 * A message node object containing explicit color metadata.
 */
export class PlayerMessageNode extends BaseMessageNode {
    protected override readonly part: TextJSONMessagePart;
    public readonly type = "player" as const;

    /** The player being referenced by this node. */
    public readonly player: Player;

    /**
     * Instantiates a new message node object.
     * @internal
     * @param client The client object containing additional context metadata for this node.
     * @param part The underlying message part component from the network protocol.
     */
    public constructor(client: Client, part: TextJSONMessagePart) {
        super(client, part);

        this.part = part;
        if (part.type === "player_id") {
            this.player = client.players.findPlayer(parseInt(part.text)) as Player;
        } else {
            // Need to work a bit harder here.
            const player = client.players.teams[client.players.self.team].find((p) => p.name === part.text);
            if (!player) {
                throw new Error(`Cannot find player under name: ${part.text}`);
            }

            this.player = player;
        }
    }

    /** The current alias of this player. */
    public get text(): string {
        return this.player.alias;
    }
}

/**
 * A type union of all known message node types. See each type for more information.
 */
export type MessageNode =
    | ItemMessageNode
    | LocationMessageNode
    | ColorMessageNode
    | TextualMessageNode
    | PlayerMessageNode;
