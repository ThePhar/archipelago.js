/**
 * Optional connection arguments when authenticating to an Archipelago server session.
 */
export type ConnectArguments = {
    /**
     * The room password, if the server requires a password to join. Otherwise, optional.
     * @default ""
     */
    readonly password?: string

    /**
     * A unique identifier for this client. Not currently used for anything server side, but may change or be deprecated
     * in a future Archipelago update.
     * @default A randomly generated UUIDv4.
     */
    readonly uuid?: string

    /**
     * A list of strings that denote special features or capabilities this sender is currently capable of. A list of
     * common tags is documented in {@link CommonTags}.
     * @default []
     * @remarks `isTracker`, `isHintGame`, and `isTextOnly` arguments will automatically add the appropriate tag.
     */
    readonly tags?: string[]

    /**
     * The version of Archipelago this client was designed for. This can be enforced on the server side to force an upto
     * date client, if a new version is released.
     * @default { major: 0, minor: 5, build: 0 }
     */
    readonly targetVersion?: {
        readonly major: number
        readonly minor: number
        readonly build: number
    }

    /**
     * Ensures the server includes slot-specific data when connecting to a slot. Can be set to `false` to save network
     * bandwidth, if that data is not required by the client.
     * @default true
     */
    readonly requestSlotData?: boolean

    /**
     * Determines the kinds of received item events the server will broadcast to the client when locations are checked.
     *
     * - `minimal` - Only cheated item events via `!getitem <item>` and `/send <item>` will be received.
     * - `external-only` - Only items sent from other worlds will be received. Does not include starting inventory.
     * - `exclude-self` - Same as `external-only`, but includes starting inventory.
     * - `exclude-starting-inventory` - Sends item events from all worlds (including own), but does not include starting
     * inventory.
     * - `all` - All item events are sent to the client.
     */
    readonly subscribedItemEvents?: "minimal" | "external-only" | "exclude-self" | "exclude-starting-inventory" | "all"

    /**
     * Automatically adds the `Tracker` tag to designate this client is a tracker and will not check locations.
     */
    readonly isTracker?: boolean

    /**
     * Automatically adds the `HintGame` tag to designate this client will be sending hints and will not check
     * locations.
     */
    readonly isHintGame?: boolean

    /**
     * Automatically adds the `TextOnly` tag to designate this client will only be chatting and will not check
     * locations.
     * @remarks This property is ignored if `isTracker` or `isHintGame` is `true`.
     */
    readonly isTextOnly?: boolean
};
