import { APBaseObject } from "./__base";
import { GameData } from "./GameData";

export interface DataPackage extends APBaseObject {
    readonly games: GameData;
}
