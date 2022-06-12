import { APBaseObject } from "./__base";

export interface Version extends APBaseObject {
    readonly class: "Version";
    readonly major: number;
    readonly minor: number;
    readonly build: number;
}
