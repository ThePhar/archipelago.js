/**
 * A custom EventTarget class with helper functions that works in multiple runtimes, without dependencies.
 * @internal
 */
export class APEventEmitter extends EventTarget {
    /**
     * Creates a custom subscriber function for a given data type, to reduce boilerplate when working with EventTargets.
     * @template T The data type for the payload.
     * @param type The event type to create a subscriber for.
     * @returns Subscribe helper function.
     */
    public createSubscriber<T>(type: string): APEventSubscriber<T> {
        return (callback: (payload: T) => void) => {
            const eventHandler = (event: Event) => {
                const payload = (event as CustomEvent).detail as T;
                callback(payload);
            };

            const unsubscribe = () => {
                this.removeEventListener(type, eventHandler);
            };

            this.addEventListener(type, eventHandler);
            return unsubscribe;
        };
    }
}

/**
 * A helper function that adds a listener for a particular event.
 * @template T The data type for the payload.
 * @internal
 * @param callback A callback with payload.
 * @returns An unsubscribe function to remove event listener when no longer needed.
 */
export type APEventSubscriber<T> = (callback: (payload: T) => void) => APEventUnsubscribe;

/**
 * A helper function to remove this listener, when no longer needed.
 * @internal
 */
export type APEventUnsubscribe = () => void;
