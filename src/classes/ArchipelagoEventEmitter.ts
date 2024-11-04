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
