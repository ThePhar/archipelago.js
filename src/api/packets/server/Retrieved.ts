import { JSONSerializable } from "../../types.ts";

/**
 * Sent to clients as a response to a {@link GetPacket}.
 *
 * Additional arguments added to the {@link GetPacket} that triggered this {@link RetrievedPacket} will also be passed
 * along.
 * @category Network Packets
 */
export interface RetrievedPacket {
    readonly cmd: "Retrieved"

    /* eslint-disable @typescript-eslint/consistent-indexed-object-style --
     * Since this has already shipped, it's TECHNICALLY a breaking change to turn all of these into interfaces.
     * While it's highly unlikely that anyone would ever notice, let's save such things for the next major version bump.
     */
    /** A key-value collection containing all the values for the keys requested in the {@link GetPacket}. */
    readonly keys: { [key: string]: JSONSerializable }

    /* eslint-enable @typescript-eslint/consistent-indexed-object-style */

    /** Additional arguments that were passed in from {@link GetPacket}. */
    readonly [p: string]: JSONSerializable
}
