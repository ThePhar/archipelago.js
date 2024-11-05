import { ConnectionError } from "./api";

/**
 * The `SocketError` object represents an error when a requested operation on the web socket connection cannot be
 * completed, such as trying to send packet data when no active connection exists.
 */
export class SocketError extends Error { }

/**
 * The `ValueError` object represents an error with a specific argument provided.
 * @template T The type of the argument value provided.
 * @remarks Only returns from methods that check for specific errors.
 */
export class ArgumentError<T> extends Error {
    /** The name of the argument with an invalid value. */
    public readonly argumentName: string;

    /** The value of the invalid argument. */
    public readonly value: T;

    /**
     * Instantiates an ArgumentError object.
     * @internal
     * @param message A human-readable error description.
     * @param argumentName The name of the argument with an invalid value.
     * @param value The value of the invalid argument.
     */
    public constructor(message: string, argumentName: string, value: T) {
        super(message);
        this.argumentName = argumentName;
        this.value = structuredClone(value);
    }
}

/**
 * The `LoginError` object represents an error when attempting to log into an Archipelago session, but authentication
 * failed. The server returns a list of known issues found while attempting to connect.
 */
export class LoginError extends Error {
    /** A list of connection errors that prevented the connection to the Archipelago server. */
    public readonly errors: ConnectionError[] = [];

    /**
     * Instantiates a LoginError object.
     * @internal
     * @param message A human-readable error description.
     * @param errors A list of connection errors the server can be returned from the server.
     */
    public constructor(message: string, errors: ConnectionError[]) {
        super(message);
        this.errors = errors;
    }
}

/**
 * The `UnauthenticatedError` object represents an error while attempting to perform an action that requires being
 * authenticated to the current session, while not being authenticated or connected to the server.
 */
export class UnauthenticatedError extends Error { }
