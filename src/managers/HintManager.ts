import { Client } from "../Client";
import { ServerPacketType } from "../enums";
import { SetReplyPacket } from "../packets";
import { Hint } from "../structs";

/**
 * Manages and watches for hint events to this player slot and provides helper functions to make working with hints
 * easier.
 */
export class HintManager {
    #client: Client<unknown>;
    #hints: Hint[] = [];

    public constructor(client: Client<unknown>) {
        this.#client = client;
        this.#client.addListener(ServerPacketType.SET_REPLY, this.#onSetReply.bind(this));
    }

    /**
     * Get all hints that are relevant for this slot.
     */
    public get mine(): ReadonlyArray<Hint> {
        return this.#hints;
    }

    #onSetReply(packet: SetReplyPacket): void {
        if (packet.key === `_read_hints_${this.#client.data.team}_${this.#client.data.slot}`) {
            this.#hints = packet.value as Hint[];
        }
    }
}
