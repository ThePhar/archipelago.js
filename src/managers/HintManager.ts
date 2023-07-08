import { Client } from "../Client.ts";
import { SERVER_PACKET_TYPE } from "../consts/CommandPacketType.ts";
import { SetReplyPacket } from "../packets/SetReplyPacket.ts";
import { Hint } from "../types/Hint.ts";

/**
 * Manages and watches for hint events to this player slot and provides helper functions to make working with hints
 * easier.
 */
export class HintManager {
    #client: Client<unknown>;
    #hints: Hint[] = [];

    public constructor(client: Client<unknown>) {
        this.#client = client;
        this.#client.addListener(SERVER_PACKET_TYPE.SET_REPLY, this.#onSetReply.bind(this));
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
