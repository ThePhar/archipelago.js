/**
 * Optional connection arguments when authenticating to an Archipelago server session.
 */
export type ConnectionArguments = {
    /**
     * The room password, if the server requires a password to join. Otherwise, optional.
     * @default ""
     */
    readonly password?: string

    /**
     * A unique identifier for this client. Not currently used for anything server side, but may change or be deprecated
     * in a future Archipelago update.
     * @default A random uuid v4.
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
     * - `external_only` - Only items sent from other worlds will be received. Does not include starting inventory.
     * - `exclude_self` - Same as `external-only`, but includes starting inventory.
     * - `exclude_starting_inventory` - Sends item events from all worlds (including own), but does not include starting
     * inventory.
     * - `all` - All item events are sent to the client.
     * @default "all"
     */
    readonly subscribedItemEvents?: "minimal" | "external_only" | "exclude_self" | "exclude_starting_inventory" | "all"

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
