import { AbstractSlotData, ClientStatus, NetworkPlayer, NetworkSlot, SlotType } from "./api";
import { ArchipelagoClient } from "./ArchipelagoClient.ts";

/**
 * An object that contains metadata about its slot and player.s
 */
export class PlayerInfo {
    #client: ArchipelagoClient<AbstractSlotData>;
    #statusMap: Map<string, ClientStatus>;
    #name: string;
    #alias: string;
    #slot: number;
    #team: number;
    #game: string;
    #type: SlotType;
    #members: number[];

    /** The connection slot name for this player. */
    public get name(): string {
        return this.#name;
    }

    /** The current aliased name for this player. If not set, will be the same as `name`. */
    public get alias(): string {
        return this.#alias;
    }

    /** The slot number for this player. */
    public get slot(): number {
        return this.#slot;
    }

    /** The team number for this player. */
    public get team(): number {
        return this.#team;
    }

    /** The game this player is playing. */
    public get game(): string {
        return this.#game;
    }

    /** The type of player this is. */
    public get type(): SlotType {
        return this.#type;
    }

    /** A human-readable status for this slot. */
    public get status(): "disconnected" | "connected" | "ready" | "playing" | "goaled" | "unknown" {
        const status = this.#statusMap.get(`${this.team}_${this.slot}`) as ClientStatus;
        switch (status) {
            case ClientStatus.Disconnected:
                return "disconnected";
            case ClientStatus.Connected:
                return "connected";
            case ClientStatus.Ready:
                return "ready";
            case ClientStatus.Playing:
                return "playing";
            case ClientStatus.Goal:
                return "goaled";
            default:
                return "unknown";
        }
    }

    /** If this player is a group, these are the members of that group. For all other types, this is `null`. */
    public get members(): PlayerInfo[] | null {
        if (this.#type !== SlotType.Group) {
            return null;
        }

        // Going to assume this should return player info, so if it doesn't that's a huge bug.
        return this.#members.map((id) => this.#client.room.findPlayer(this.team, id) as PlayerInfo);
    }

    /**
     * Creates a PlayerInfo object.
     * @internal
     * @param client The Archipelago client.
     * @param player The NetworkPlayer object associated with this slot.
     * @param slot The NetworkSlot object associated with this slot.
     * @param statusMap
     */
    public constructor(
        client: ArchipelagoClient<AbstractSlotData>,
        player: NetworkPlayer,
        slot: NetworkSlot,
        statusMap: Map<string, ClientStatus>
    ) {
        this.#client = client;
        this.#statusMap = statusMap;
        this.#name = player.name;
        this.#alias = player.alias;
        this.#slot = player.slot;
        this.#team = player.team;
        this.#game = slot.game;
        this.#type = slot.type;
        this.#members = slot.group_members;
    }
}
