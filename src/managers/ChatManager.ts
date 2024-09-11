import { ArchipelagoClient } from "../structs/ArchipelagoClient.ts";

/**
 * Keeps track of message logs and provides helper methods for chatting.
 */
export class ChatManager {
    readonly #client: ArchipelagoClient;
    #messageLog: string[] = [];

    /**
     * Instantiates a new ChatManager.
     * @internal
     * @param client The Archipelago client associated with this manager.
     */
    public constructor(client: ArchipelagoClient) {
        this.#client = client;

        this.#client.api.subscribe("onPrintJSON", (packet) => {
            const message = packet.data.reduce((message, part) => message + part.text, "");
            this.#messageLog.push(message);
        });
    }

    public get messageLog(): string[] {
        return structuredClone(this.#messageLog);
    }

    public say(message: string): void {
        this.#client.api.send({ cmd: "Say", text: message.trim() });
    }
}
