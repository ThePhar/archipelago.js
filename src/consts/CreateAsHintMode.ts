import { ObjectValues } from "../types/ObjectValues";

/**
 * The hint type for `create_as_hint` in {@link LocationScoutsPacket}.
 */
export const CREATE_AS_HINT_MODE = {
    /** Does not mark any location to be hinted and broadcast to clients. */
    NO_HINT: 0,

    /** Mark all locations as hinted and show to all relevant clients. */
    HINT_EVERYTHING: 1,

    /** Mark all locations as hinted and show only newly hinted locations to relevant clients. */
    HINT_ONLY_NEW: 2,
} as const;

export type CreateAsHintMode = ObjectValues<typeof CREATE_AS_HINT_MODE>;
