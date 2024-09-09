/**
 * A const containing the possible command permissions, for commands that may be restricted.
 */
export const enum Permission {
    /** Prevents players from using this command at any time. */
    Disabled = 0,

    /** Allows players to use this command manually at any time. */
    Enabled = 0b001,

    /** Allows players to use this command manually after they have completed their goal. */
    Goal = 0b010,

    /**
     * Forces players to use this command after they have completed their goal.
     * @remarks Only allowed on {@link PermissionTable.release} and {@link PermissionTable.collect} permissions.
     */
    Auto = 0b110,

    /**
     * Allows players to use this command manually at any time and forces them to use this command after they have
     * completed their goal.
     * @remarks Only allowed on {@link PermissionTable.release} and {@link PermissionTable.collect} permissions.
     */
    AutoEnabled = 0b111,
}

/** Mapping of restrict-able commands to their current {@link Permission} level. */
export type PermissionTable = {
    /**
     * Dictates what is allowed when it comes to a player releasing their run. A release is an action which
     * distributes the rest of the items in a player's run to those other players awaiting them.
     *
     * - {@link Permission.Auto}: Distributes a player's items to other players when they complete their goal.
     * - {@link Permission.Enabled}: Denotes that players may `!release` at any time in the game.
     * - {@link Permission.AutoEnabled}: Both of the above options together.
     * - {@link Permission.Disabled}: All forfeit modes disabled.
     * - {@link Permission.Goal}: Allows for manual use of `!release` command once a player completes their
     * goal (disabled until goal completion).
     */
    readonly release: Permission

    /**
     * Dictates what is allowed when it comes to a player collecting their run. A collect is an action which sends
     * the rest of the items in a player's run.
     *
     * - {@link Permission.Auto}: Automatically when they complete their goal.
     * - {@link Permission.Enabled}: Denotes that players may `!collect` at any time in the game.
     * - {@link Permission.AutoEnabled}: Both of the above options together.
     * - {@link Permission.Disabled}: All collect modes disabled.
     * - {@link Permission.Goal}: Allows for manual use of `!collect` command once a player completes their
     * goal (disabled until goal completion).
     */
    readonly collect: Permission

    /**
     * Dictates what is allowed when it comes to a player querying the items remaining in their run.
     *
     * - {@link Permission.Goal}: Allows a player to query for items remaining in their run but only after they
     * completed their own goal.
     * - {@link Permission.Enabled}: Denotes that players may query for any items remaining in their run (even
     * those belonging to other players).
     * - {@link Permission.Disabled}: All remaining item query modes disabled.
     * @remarks This command cannot have the {@link Permission.Auto} or {@link Permission.AutoEnabled} permission.
     */
    readonly remaining: Permission
};
