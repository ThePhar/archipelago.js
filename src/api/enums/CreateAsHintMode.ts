/**
 * The hint type for `create_as_hint` in {@link NetworkPackets.LocationScoutsPacket}.
 */
export const enum CreateAsHintMode {
    /** Does not mark scouted location to be hinted and broadcast to clients. */
    NoHint = 0,

    /** Mark all scouted locations as hinted and show to all relevant clients. */
    HintAlways = 1,

    /** Mark all scouted locations as hinted, but only show newly hinted locations to relevant clients. */
    HintNew = 2,
}
