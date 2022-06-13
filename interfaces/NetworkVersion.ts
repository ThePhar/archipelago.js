import { APBaseObject } from "./__base";

export class NetworkVersion implements APBaseObject {
    public readonly class = "Version";
    public readonly major: number;
    public readonly minor: number;
    public readonly build: number;

    public constructor(major = 0, minor = 0, build = 0) {
        // Throw an error if a number is not a safe integer.
        if (!Number.isSafeInteger(major) || !Number.isSafeInteger(minor) || !Number.isSafeInteger(build)) {
            throw new Error("Version numbers must consist of safe integers only.");
        }

        // Throw an error if a number is less than 0.
        if (major < 0 || minor < 0 || build < 0) {
            throw new Error("Version numbers must not be less than 0.");
        }

        this.major = major;
        this.minor = minor;
        this.build = build;
    }
}
