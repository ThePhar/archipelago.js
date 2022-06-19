/**
 * An enumeration containing the possible command permissions, for commands that may be restricted.
 */
export declare enum Permission {
    /** Prevents players from using this command at any time. */
    DISABLED = 0,
    /** Allows players to use this command manually at any time. */
    ENABLED = 1,
    /** Allows players to use this command manually after they have completed their goal. */
    GOAL = 2,
    /**
     * Forces players to use this command after they have completed their goal. Only works for `!forfeit` and `!collect`
     */
    AUTO = 6,
    /**
     * Allows players to use this command manually at any time and forces them to use this command after they have
     * completed their goal.
     */
    AUTO_ENABLED = 7
}
//# sourceMappingURL=Permission.d.ts.map