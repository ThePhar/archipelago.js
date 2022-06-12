export interface APBasePacket {
    readonly cmd: string;
    readonly [parameter: string]: APType;
}

export interface APBaseObject {
    readonly class?: string;
    readonly [parameter: string]: APType;
}

export type APBaseType = string | number | boolean | null | undefined | APBaseObject;
export type APType = APBaseType | APBaseType[];
