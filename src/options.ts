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
}

/**
 * @internal
 * @remarks If any of these are updated, also update the JSDoc above.
 */
export const defaultClientOptions: Required<ClientOptions> = {
    timeout: 10000,
    autoFetchDataPackage: true,
};
