/**
 * An error object that can be returned if there is an issue with communicating over a socket.
 */
class APSocketError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "SocketError";
    }
}

export {
    APSocketError,
};
