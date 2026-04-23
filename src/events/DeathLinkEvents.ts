/* eslint-disable @typescript-eslint/consistent-type-definitions --
 *
 * Since this has already shipped, it's TECHNICALLY a breaking change to turn all of these into interfaces.
 * While it's highly unlikely that anyone would ever notice, let's save such things for the next major version bump.
 */

/**
 * An interface with all supported death events and their respective callback arguments. To be called from
 * {@link MessageManager}.
 */
export type DeathEvents = {
    /**
     * Fired when a DeathLink-enabled player has sent a DeathLink.
     * @param source The player who sent this DeathLink.
     * @param time The timestamp this player died. Time is in number of milliseconds from unix epoch (same timestamp
     * system in JavaScript).
     * @param cause Optional description detailing the specific cause of death.
     */
    deathReceived: [source: string, time: number, cause?: string]
};

/* eslint-enable @typescript-eslint/consistent-type-definitions */
