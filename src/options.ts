import { itemsHandlingFlags } from "./api";
import { targetVersion } from "./constants.ts";
import { generateUuid } from "./utils.ts";

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
}

/**
 * Default {@link ClientOptions}.
 * @internal
 */
export const defaultClientOptions: Required<ClientOptions> = {
    timeout: 10000,
    autoFetchDataPackage: true,
    maximumMessages: 1000,
};

/**
 * An interface of additional connection arguments when authenticating to an Archipelago server.
 */
export interface ConnectionOptions {
    /**
     * The room password, if the server requires a password to join. Otherwise, optional.
     * @default ""
     */
    readonly password?: string

    /**
     * A unique identifier for this client.
     *
     * Not currently used for anything server side, but may change or be deprecated in a future Archipelago update.
     * @remarks Defaults to a randomly generated v4 UUID.
     */
    readonly uuid?: string

    /**
     * A list of strings that denote special features or capabilities this sender is currently capable of. A list of
     * common tags is documented here:
     *
     * {@link https://github.com/ArchipelagoMW/Archipelago/blob/main/docs/network%20protocol.md#tags}.
     * @default []
     */
    readonly tags?: string[]

    /**
     * The version of Archipelago this client was designed for. This can be enforced on the server side to force a user
     * to update their client, if a new version was released.
     *
     * Must be in the format: `major`.`minor`.`build` (e.g., `"0.5.0"`)
     * @default {@link targetVersion}
     */
    readonly version?: string

    /**
     * Determines the kinds of received item events the server will broadcast to this client when locations are checked.
     *
     * Value is an integer bitflag combination of values that is documented in {@link itemsHandlingFlags}.
     * @default {@link itemsHandlingFlags.all}
     * @remarks Defaults to request all received item events, so unless you need local-only functionality this property
     * can usually be omitted.
     */
    readonly items?: number

    /**
     * Request this slot's data during connection. If `false`, server will respond with an empty object (`{}`) instead.
     * @default true
     */
    readonly slotData?: boolean
}

/**
 * Default {@link ConnectionOptions}.
 * @internal
 */
export const defaultConnectionOptions: Required<ConnectionOptions> = {
    password: "",
    uuid: generateUuid(),
    tags: [],
    version: targetVersion,
    items: itemsHandlingFlags.all,
    slotData: true,
};
