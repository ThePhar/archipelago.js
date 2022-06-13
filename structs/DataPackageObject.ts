import { APBaseObject, GameData } from "@structs";

export interface DataPackageObject extends APBaseObject {
    readonly games: GameData;
}
