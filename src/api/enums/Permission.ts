/**
 * A const containing the possible command permissions, for commands that may be restricted.
 * @internal
 */
export const enum AutoPermission {
    /** Prevents players from using this command at any time. */
    Disabled = 0,

    /** Allows players to use this command manually at any time. */
    Enabled = 0b001,

    /** Allows players to use this command manually after they have completed their goal. */
    Goal = 0b010,

    /**
     * Forces players to use this command after they have completed their goal. Only works for `!release` and `!collect`
     */
    Auto = 0b110,

    /**
     * Allows players to use this command manually at any time and forces them to use this command after they have
     * completed their goal.
     */
    AutoEnabled = 0b111,
}

/**
 * A const containing the possible command permissions, for commands that may be restricted and do not support auto
 * modes.
 * @internal
 */
export const enum Permission {
    /** Prevents players from using this command at any time. */
    Disabled = 0,

    /** Allows players to use this command manually at any time. */
    Enabled = 0b001,

    /** Allows players to use this command manually after they have completed their goal. */
    Goal = 0b010,
}
