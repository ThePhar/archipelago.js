import { Client } from "../client.ts";

/**
 * An abstract class for managers that offer an event-based API.
 * @template Events An interface of events supported by this derived manager.
 */
export abstract class EventBasedManager<Events extends { [p: string]: unknown[] }> {
    readonly #client: Client;
    readonly #events = new ArchipelagoEventEmitter();

    /**
     * Instantiates this manager. Should only be instantiated by creating a new {@link Client}.
     * @internal
     * @param client The client object this manager is associated with.
     */
    protected constructor(client: Client) {
        this.#client = client;
    }

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
        return new Promise<Events[Event]>((resolve, reject) => {
            const timeout = setTimeout(
                () => {
                    this.#events.removeEventListener(event, listener);
                    reject(new Error("Server did not respond within the maximum timeout time."));
                },
                this.#client.options.timeout,
            );

            const listener = (...args: Events[Event]) => {
                if (clearPredicate(...args)) {
                    clearTimeout(timeout);
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

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument */
type EventCallback = (...args: any[]) => void;

/**
 * A reimplementation of an EventEmitter that is runtime agnostic.
 * @internal
 */
export class ArchipelagoEventEmitter {
    #events: Record<string, [callback: EventCallback, once: boolean][]> = {};

    public addEventListener(event: string, callback: EventCallback, once = false): void {
        // Ensure list is not empty.
        this.#events[event] ??= [];
        this.#events[event].push([callback, once]);
    }

    public removeEventListener(event: string, callback: EventCallback): void {
        const callbacks = this.#events[event];
        if (callbacks && callbacks.length > 0) {
            this.#events[event] = callbacks.filter(([cb]) => cb !== callback);
        }
    }

    public dispatchEvent(event: string, data: any): void {
        const callbacks = this.#events[event] ?? [];
        for (const [callback, once] of callbacks) {
            callback(...data);
            if (once) {
                this.removeEventListener(event, callback);
            }
        }
    }
}
