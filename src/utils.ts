/**
 * Generate a random uuid version 4 hexadecimal string.
 * @internal
 */
export function generateUuid(): string {
    const uuid: (number | string)[] = [];
    for (let i = 0; i < 36; i++) {
        uuid.push(Math.floor(Math.random() * 16));
    }

    uuid[14] = 4;
    uuid[19] = (uuid[19] as number) &= ~(1 << 2);
    uuid[19] = uuid[19] |= (1 << 3);
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = "-"; // Separators.
    return uuid.map((d) => d.toString(16)).join("");
}

/**
 * A helper function that adds a listener for a particular event.
 * @template T The type for the returned data.
 * @internal
 * @param callback A callback with data.
 * @returns An unsubscribe function to remove event listener when no longer needed.
 */
export type APEventSubscriber<T> = (callback: (data: T) => void) => APEventUnsubscribe;

/**
 * A helper function to remove this listener, when no longer needed.
 */
export type APEventUnsubscribe = () => void;

/**
 * Creates a custom subscriber function for a given data type, to reduce boilerplate when working with EventTargets.
 * @template T The data type for the payload.
 * @internal
 * @param emitter The EventTarget to create a listener/unsubscriber for.
 * @param type The event type to create a subscriber for.
 * @returns Subscribe helper function.
 */
export function createSubscriber<T>(emitter: EventTarget, type: string): APEventSubscriber<T> {
    return (callback: (data: T) => void) => {
        const eventHandler = (event: Event) => {
            callback((event as CustomEvent).detail as T);
        };

        const unsubscribe = () => {
            emitter.removeEventListener(type, eventHandler);
        };

        emitter.addEventListener(type, eventHandler);
        return unsubscribe;
    };
}

/**
 * Finds the first appropriate WebSocket prototype available in the current scope.
 * @internal
 * @returns The first WebSocket class available or `null` if none available.
 * @remarks Not all features of the Web WebSocket API maybe available (due to runtime differences), so care should be
 * taken when interacting with the API directly.
 */
export function findWebSocket(): typeof WebSocket | null {
    let IsomorphousWebSocket: typeof WebSocket | null = null;
    if (typeof window !== "undefined") {
        // @ts-expect-error WebSocket may not exist in this context.
        IsomorphousWebSocket = window.WebSocket || window.MozWebSocket;
    } else if (typeof global !== "undefined") {
        // @ts-expect-error WebSocket may not exist in this context.
        IsomorphousWebSocket = global.WebSocket || global.MozWebSocket;
    } else if (typeof self !== "undefined") {
        // @ts-expect-error WebSocket may not exist in this context.
        IsomorphousWebSocket = self.WebSocket || self.MozWebSocket;
    } else if (typeof WebSocket !== "undefined") {
        IsomorphousWebSocket = WebSocket;
        // @ts-expect-error WebSocket may not exist in this context.
    } else if (typeof MozWebSocket !== "undefined") {
        // @ts-expect-error WebSocket may not exist in this context.
        IsomorphousWebSocket = MozWebSocket as WebSocket;
    }

    return IsomorphousWebSocket;
}
