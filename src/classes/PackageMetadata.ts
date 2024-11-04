import { GamePackage } from "../api";

/**
 * An abstraction of a {@link GamePackage} object which includes additional helper methods for interacting with a game's
 * package.
 */
export class PackageMetadata {
    /** The name of the game this game package is for. */
    public readonly game: string;

    /** The SHA256 hexadecimal string representation of this game package. */
    public readonly checksum: string;

    /** A record of names to ids for all items in this game package. */
    public readonly itemTable: Readonly<Record<string, number>>;

    /** A record of names to ids for all locations in this game package. */
    public readonly locationTable: Readonly<Record<string, number>>;

    /** A record of ids to names for all items in this game package. */
    public readonly reverseItemTable: Readonly<Record<string, string>>;

    /** A record of ids to names for all locations in this game package. */
    public readonly reverseLocationTable: Readonly<Record<string, string>>;

    /**
     * Creates a new PackageMetadata from a given {@link GamePackage}.
     * @internal
     * @param game The name of the game for this game package.
     * @param _package The API-level game package to expand upon.
     */
    public constructor(game: string, _package: GamePackage) {
        this.game = game;
        this.checksum = _package.checksum;
        this.itemTable = Object.freeze(_package.item_name_to_id);
        this.locationTable = Object.freeze(_package.location_name_to_id);
        this.reverseItemTable = Object.freeze(Object.fromEntries(Object
            .entries(this.itemTable)
            .map(([k, v]) => [v, k]),
        ));
        this.reverseLocationTable = Object.freeze(Object.fromEntries(Object
            .entries(this.locationTable)
            .map(([k, v]) => [v, k]),
        ));
    }

    /**
     * Returns a network-safe {@link GamePackage} that can be cached and preloaded ahead of time to reduce network load.
     */
    public exportPackage(): GamePackage {
        return {
            checksum: this.checksum,
            item_name_to_id: { ...this.itemTable },
            location_name_to_id: { ...this.locationTable },
        };
    }
}
