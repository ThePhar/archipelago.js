import { BasePacket } from "@packets";
import { APType, DataOperation } from "@structs";

export class SetPacket implements BasePacket {
    public readonly cmd = "Set";
    public readonly key: string;
    public readonly default: APType;
    public readonly operations: ReadonlyArray<DataOperation>;
    public readonly want_reply?: boolean;

    public constructor(key: string, defaultValue: APType, operations: DataOperation[], wantReply = false) {
        this.key = key;
        this.default = defaultValue;
        this.operations = operations;
        this.want_reply = wantReply;
    }
}
