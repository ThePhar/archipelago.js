import { APBaseObject } from "./__base";

export interface DeathLinkData extends APBaseObject {
    readonly time: number;
    readonly source: string;
    readonly cause?: string;
}
