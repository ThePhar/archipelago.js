/**
 * The hint type for `create_as_hint` in {@link LocationScoutsPacket}.
 */
export const enum CreateAsHintMode {
    /** Does not mark any location to be hinted and broadcast to clients. */
    NO_HINT = 0,

    /** Mark all locations as hinted and show to all relevant clients. */
    HINT_EVERYTHING = 1,

    /** Mark all locations as hinted and show only newly hinted locations to relevant clients. */
    HINT_ONLY_NEW = 2,
}
