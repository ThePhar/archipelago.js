import { APBasePacket } from "../__base";

export interface GetDataPackagePacket extends APBasePacket {
    readonly cmd: "GetDataPackage";
    readonly games?: string[];
}
