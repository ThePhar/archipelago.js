import { APBasePacket } from "../__base";
import { DataPackage } from "../DataPackage";

export interface DataPackagePacket extends APBasePacket {
    readonly cmd: "DataPackage";
    readonly data: DataPackage;
}
