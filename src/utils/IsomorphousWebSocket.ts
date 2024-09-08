// Ignoring typescript checking in this file since the type-system is going to be very upset by this monstrosity.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

/**
 * @internal
 * @returns The first WebSocket class available or `null` if none available.
 * @remarks Not all features of the Web WebSocket API maybe available, so care should be taken when interacting with the
 * API directly.
 */
let IsomorphousWebSocket: typeof WebSocket | null = null;

if (typeof window !== "undefined") {
    IsomorphousWebSocket = window.WebSocket || window.MozWebSocket;
} else if (typeof global !== "undefined") {
    IsomorphousWebSocket = global.WebSocket || global.MozWebSocket;
} else if (typeof self !== "undefined") {
    IsomorphousWebSocket = self.WebSocket || self.MozWebSocket;
} else if (typeof WebSocket !== "undefined") {
    IsomorphousWebSocket = WebSocket;
} else if (typeof MozWebSocket !== "undefined") {
    IsomorphousWebSocket = MozWebSocket as WebSocket;
}

export { IsomorphousWebSocket };
