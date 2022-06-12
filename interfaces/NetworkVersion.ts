import { APBaseObject } from "./__base";

export interface NetworkVersion extends APBaseObject {
    readonly major: number;
    readonly minor: number;
    readonly build: number;
}
