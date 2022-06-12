import { APBaseObject } from "./__base";

export interface NetworkPlayer extends APBaseObject {
    readonly team: number;
    readonly slot: number;
    readonly alias: string;
    readonly name: string;
}
