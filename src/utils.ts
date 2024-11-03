import { NetworkVersion } from "./api";

/**
 * Converts a string version number to a {@link NetworkVersion}.
 * @internal
 * @param input Version input string. Must be in format of: `major.minor.build`
 * @throws Error If input string is invalid format.
 */
export function parseVersion(input: string): NetworkVersion {
    // major.minor.build
    const regex = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;
    const result = regex.exec(input);

    if (!result) {
        throw new Error("Invalid version format provided. Must be in format: major.minor.build (e.g., 0.5.0)");
    }

    return {
        class: "Version",
        major: parseInt(result[1]),
        minor: parseInt(result[2]),
        build: parseInt(result[3]),
    };
}

/**
 * Converts a {@link NetworkVersion} to its string representation.
 * @internal
 * @param input The network version object to stringify.
 */
export function stringifyVersion(input: NetworkVersion): string {
    return `${input.major}.${input.minor}.${input.build}`;
}

/**
 * Generate a random uuid version 4 hexadecimal string.
 * @internal
 */
export function generateUuid(): string {
    const uuid: (number | string)[] = [];
    for (let i = 0; i < 36; i++) {
        uuid.push(Math.floor(Math.random() * 16));
    }

    uuid[14] = 4;
    uuid[19] = (uuid[19] as number) &= ~(1 << 2);
    uuid[19] = uuid[19] |= (1 << 3);
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = "-"; // Separators.
    return uuid.map((d) => d.toString(16)).join("");
}
