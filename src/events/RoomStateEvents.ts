import { PermissionTable } from "../api";

/* eslint-disable @typescript-eslint/consistent-type-definitions --
 *
 * Since this has already shipped, it's TECHNICALLY a breaking change to turn all of these into interfaces.
 * While it's highly unlikely that anyone would ever notice, let's save such things for the next major version bump.
 */

/**
 * An interface with all supported room events and their respective callback arguments. To be called from
 * {@link RoomStateManager}.
 */
export type RoomStateEvents = {
    /**
     * Fires when the room password has been toggled.
     * @param password If the room now requires a password to join.
     */
    passwordUpdated: [password: boolean]

    /**
     * Fires when command permissions have been updated.
     * @param oldValue The previous command permissions table.
     * @param newValue The new command permissions table.
     */
    permissionsUpdated: [oldValue: PermissionTable, newValue: PermissionTable]

    /**
     * Fires when the location check points have been updated.
     * @param oldValue The previous location check points value.
     * @param newValue The new location check points value.
     */
    locationCheckPointsUpdated: [oldValue: number, newValue: number]

    /**
     * Fires when the hint cost has been updated.
     * @param oldCost The previous amount of hint points required to request a hint.
     * @param newCost The new amount of hint points required to request a hint.
     * @param oldPercentage The old hint cost percentage.
     * @param newPercentage The new hint cost percentage.
     */
    hintCostUpdated: [oldCost: number, newCost: number, oldPercentage: number, newPercentage: number]

    /**
     * Fires when the player's hint points value has updated.
     * @param oldValue The old hint point value.
     * @param newValue The new hint point value.
     */
    hintPointsUpdated: [oldValue: number, newValue: number]

    /**
     * Fires when new locations have been checked (or all locations on initial connection).
     * @param locations All the newly checked locations.
     */
    locationsChecked: [locations: number[]]
};

/* eslint-enable @typescript-eslint/consistent-type-definitions */
