import { clientStatuses, NetworkPlayer, NetworkSlot } from "../../api";
import { PlayerEvents } from "../../events/PlayerEvents.ts";
import { Client } from "../Client.ts";
import { Player } from "../Player.ts";
import { EventBasedManager } from "./EventBasedManager.ts";

/** A type alias for any known client status. See {@link clientStatuses} for more information. */
export type ClientStatus = typeof clientStatuses[keyof typeof clientStatuses];

/**
 * Manages tracking and updating all players in the room session.
 */
export class PlayersManager extends EventBasedManager<PlayerEvents> {
    readonly #client: Client;
    #players: NetworkPlayer[][] = [];
    #slots: Readonly<Record<string, NetworkSlot>> = {};
    #slot: number = 0;
    #team: number = 0;

    /**
     * Instantiates a new PlayersManager.
     * @internal
     * @param client The Archipelago client associated with this manager.
     */
    public constructor(client: Client) {
        super();
        this.#client = client;

        this.#client.socket
            .on("connected", (packet) => {
                this.#slots = Object.freeze(packet.slot_info);
                this.#players = [];
                this.#slot = packet.slot;
                this.#team = packet.team;

                // Populate players.
                for (const player of packet.players) {
                    this.#players[player.team] ??= [{ team: player.team, slot: 0, name: "Archipelago", alias: "Archipelago" }];
                    this.#players[player.team][player.slot] = player;
                }
            })
            .on("roomUpdate", (packet) => {
                // Ignore any updates that don't include player updates.
                if (!packet.players) {
                    return;
                }

                for (const player of packet.players) {
                    if (this.#players[player.team][player.slot].alias !== player.alias) {
                        const oldAlias = this.#players[player.team][player.slot].alias;
                        this.#players[player.team][player.slot] = player;
                        this.emit("aliasUpdated", [new Player(this.#client, player), oldAlias, player.alias]);
                    }
                }
            });
    }

    /**
     * Returns the {@link Player} for this client's player.
     * @throws Error If attempting to lookup {@link Player} object before connecting to the server.
     */
    public get self(): Player {
        if (this.#slot === 0) {
            throw new Error("Cannot lookup own player object when client has never connected to a server.");
        }

        return new Player(this.#client, this.#players[this.#team][this.#slot]);
    }

    /**
     * Returns a record of basic information for each slot.
     * @remarks Slot information is shared across each team. For accessing player data, see {@link PlayersManager}.
     */
    public get slots(): Readonly<Record<number, NetworkSlot>> {
        return this.#slots;
    }

    /**
     * Returns a 2D array of player metadata ranked by team number, then slot number.
     * @example <caption>Print All Player Aliases to Console</caption>
     * for (const team of client.players.teams) {
     *     for (const player of team) {
     *         console.log(player.alias);
     *     }
     * }
     */
    public get teams(): Player[][] {
        const players: Player[][] = [];
        for (let team = 0; team < this.#players.length; team++) {
            players[team] = [];
            for (let player = 0; player < this.#players[team].length; player++) {
                players[team].push(new Player(this.#client, this.#players[team][player]));
            }
        }

        return players;
    }

    /**
     * Attempt to find a player by their team or slot name.
     * @param team The team id associated with the searched player.
     * @param slot The slot id associated with the searched player.
     * @returns The player's metadata or `undefined` if not found.
     */
    public findPlayer(team: number, slot: number): Player | undefined {
        const playerTeam = this.#players[team];
        if (playerTeam) {
            return new Player(this.#client, this.#players[team][slot]);
        }

        return undefined;
    }
}
