import { ArchipelagoEventEmitter } from "../ArchipelagoEventEmitter.ts";

/**
 * An abstract class for managers that offer an event-based API.
 * @template Events An interface of events supported by this derived manager.
 */
export abstract class EventBasedManager<Events extends { [p: string]: unknown[] }> {
    readonly #events = new ArchipelagoEventEmitter();

    /**
     * Add an event listener for a specific event.
     * @param event The event name to listen for.
     * @param listener The callback function to fire when this event is received.
     * @returns This object.
     */
    public on<Event extends keyof Events & string>(event: Event, listener: (...args: Events[Event]) => void): this {
        this.#events.addEventListener(event, listener);
        return this;
    }

    /**
     * Removes an existing event listener.
     * @param event The event name associated with this listener to remove.
     * @param listener The callback function to remove.
     * @returns This object.
     */
    public off<Event extends keyof Events & string>(event: Event, listener: (...args: Events[Event]) => void): this {
        this.#events.removeEventListener(event, listener);
        return this;
    }

    /**
     * Returns a promise that waits for a single specified event to be received. Resolves with the list of arguments
     * dispatched with the event.
     * @param event The event name to listen for.
     * @param clearPredicate An optional predicate to check on incoming events to validate if the correct event has
     * been received. If omitted, will return immediately on next event type received.
     */
    public async wait<Event extends keyof Events & string>(
        event: Event,
        clearPredicate: (...args: Events[Event]) => boolean = () => true,
    ): Promise<Events[Event]> {
        return new Promise<Events[Event]>((resolve) => {
            const listener = (...args: Events[Event]) => {
                if (clearPredicate(...args)) {
                    this.#events.removeEventListener(event, listener);
                    resolve(args);
                }
            };

            this.#events.addEventListener(event, listener);
        });
    }

    /**
     * Emit a specific event.
     * @internal
     * @param event The event name to emit.
     * @param detail A list of arguments to broadcast with this event.
     * @protected
     */
    protected emit<Event extends keyof Events & string>(event: Event, detail: Events[Event]): void {
        this.#events.dispatchEvent(event, detail);
    }
}
