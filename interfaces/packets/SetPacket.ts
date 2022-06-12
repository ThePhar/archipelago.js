import { APBasePacket, APType } from "../__base";
import { DataOperation } from "../DataOperations";

export interface SetPacket extends APBasePacket {
    readonly cmd: "Set";
    readonly key: string;
    readonly default: APType;
    readonly want_reply?: boolean;
    readonly operations: DataOperation[];
}
