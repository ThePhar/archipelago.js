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
