import { APBaseObject } from "./__base";

export class NetworkVersion implements APBaseObject {
    public readonly class = "Version";
    public readonly major: number;
    public readonly minor: number;
    public readonly build: number;

    public constructor(major = 0, minor = 0, build = 0) {
        this.major = major;
        this.minor = minor;
        this.build = build;
    }
}
