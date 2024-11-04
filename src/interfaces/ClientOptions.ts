/**
 * An interface of client options that can be set on a {@link Client} object.
 */
export interface ClientOptions {
    /**
     * The maximum number of milliseconds to wait for a response from the server when awaiting a response to a client
     * packet.
     * @default 10000
     */
    timeout?: number

    /**
     * Automatically requests the DataPackage from the server during {@link Client.login}, if the packages are missing
     * in the {@link DataPackageManager}.
     * @default true
     */
    autoFetchDataPackage?: boolean

    /**
     * Determines the maximum number of chat messages to log in {@link MessageManager}.
     * @default 1000
     * @remarks If `0` or fewer, message logging will effectively be disabled.
     */
    maximumMessages?: number

    /**
     * If enabled, logs the game, library version, and user agent to data storage, which can be used for debugging
     * purposes.
     * @default true
     */
    debugLogVersions: boolean
}

/**
 * Default {@link ClientOptions}.
 * @internal
 */
export const defaultClientOptions: Required<ClientOptions> = {
    timeout: 10000,
    autoFetchDataPackage: true,
    maximumMessages: 1000,
    debugLogVersions: true,
};
