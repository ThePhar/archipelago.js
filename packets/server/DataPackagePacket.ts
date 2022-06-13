import { BasePacket } from "@packets";
import { DataPackageObject } from "@structs";

export interface DataPackagePacket extends BasePacket {
    readonly cmd: "DataPackage";
    readonly data: DataPackageObject;
}
