import { UnauthenticatedError } from "../../errors.ts";
import { DeathEvents } from "../../events/DeathLinkEvents.ts";
import { Client } from "../Client.ts";
import { EventBasedManager } from "./EventBasedManager.ts";

type DeathLinkData = { time: number, cause?: string, source: string };

/**
 * Manages DeathLink mechanics for clients that choose to opt in to the mechanic.
 */
export class DeathLinkManager extends EventBasedManager<DeathEvents> {
    readonly #client: Client;
    #lastDeath: number = Number.MIN_SAFE_INTEGER;

    /**
     * Instantiates a new DeathLinkManager.
     * @internal
     * @param client The Archipelago client associated with this manager.
     */
    public constructor(client: Client) {
        super();
        this.#client = client;

        this.#client.socket.on("bounced", (packet) => {
            // Check if DeathLink packet.
            if (packet.tags?.includes("DeathLink") && packet.data.time && packet.data.source) {
                // Good enough for me.
                const deathLink = packet.data as DeathLinkData;

                // Ignore any DeathLinks from ourselves we *just* sent, by checking if the timestamp is ours.
                if (deathLink.time === this.#lastDeath) {
                    return;
                }

                // Use this timestamp as our new death value and tell the subscriber we died (also convert time to
                // JS-compatible timestamp).
                this.#lastDeath = deathLink.time;
                this.emit("deathReceived", [deathLink.source, deathLink.time * 1000, deathLink.cause]);
            }
        });
    }

    /** Returns `true` if this client is participating in the DeathLink mechanic. */
    public get enabled(): boolean {
        return this.#client.arguments.tags.includes("DeathLink");
    }

    /** Toggles the DeathLink mechanic on for this client, if disabled, by adding the DeathLink tag. */
    public enableDeathLink(): void {
        if (this.#client.arguments.tags.includes("DeathLink")) {
            return;
        }

        this.#client.updateTags([...this.#client.arguments.tags, "DeathLink"]);
    }

    /** Toggles the DeathLink mechanic off for this client, if enabled, by removing the DeathLink tag. */
    public disableDeathLink(): void {
        if (!this.#client.arguments.tags.includes("DeathLink")) {
            return;
        }

        this.#client.updateTags(this.#client.arguments.tags.filter((tag) => tag !== "DeathLink"));
    }

    /**
     * If DeathLink is enabled, sends a DeathLink to all DeathLink enabled players, otherwise this method does nothing.
     * @param source The name of the player who died. Can be a slot name, but could also be a name from within a
     * multiplayer game.
     * @param cause Optional text explaining the cause of death. When provided, this should include the player's name.
     * (e.g., `Phar drowned in a vat of kittens.`)
     * @throws UnauthenticatedError If attempting to send a death link before authenticating to the server.
     * @remarks DeathLinks sent from this client will not fire a {@link DeathEvents.deathReceived} event to avoid
     * an infinite feedback loop of deaths.
     */
    public sendDeathLink(source: string, cause?: string): void {
        if (!this.#client.authenticated) {
            throw new UnauthenticatedError("Cannot send death links before connecting and authenticating.");
        }

        if (!this.enabled) {
            return;
        }

        // JS timestamps are in milliseconds instead of seconds, so we need to correct it or other clients will think
        // we're dying in the future. We'll also round up just to be safe.
        this.#lastDeath = Math.ceil(Date.now() / 1000);

        const deathLink: DeathLinkData = {
            source,
            cause,
            time: this.#lastDeath,
        };
        this.#client.bounce({ tags: ["DeathLink"] }, deathLink);
    }
}
