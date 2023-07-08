import { Client } from "../Client.ts";
import { CLIENT_PACKET_TYPE, SERVER_PACKET_TYPE } from "../consts/CommandPacketType.ts";
import { RetrievedPacket } from "../packets/RetrievedPacket.ts";
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
        this.#client.addListener(SERVER_PACKET_TYPE.RETRIEVED, this.#onRetrieved.bind(this));
        this.#client.addListener(SERVER_PACKET_TYPE.CONNECTED, this.#onConnected.bind(this));
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

    #onRetrieved(packet: RetrievedPacket): void {
        for (const key in packet.keys) {
            if (key !== `_read_hints_${this.#client.data.team}_${this.#client.data.slot}`) {
                continue;
            }

            this.#hints = packet.keys[key] as Hint[];
        }
    }

    #onConnected(): void {
        // Once connected, let's send out our set_notify for hints.
        this.#client.send(
            {
                cmd: CLIENT_PACKET_TYPE.SET_NOTIFY,
                keys: [`_read_hints_${this.#client.data.team}_${this.#client.data.slot}`],
            },
            {
                cmd: CLIENT_PACKET_TYPE.GET,
                keys: [`_read_hints_${this.#client.data.team}_${this.#client.data.slot}`],
            },
        );
    }
}
