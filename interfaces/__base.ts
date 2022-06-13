export interface APBasePacket {
    readonly cmd: string;
}

export interface APBaseObject {
    readonly class?: string;
}

export type APBaseType = string | number | boolean | null | undefined | APBaseObject;
export type APType = APBaseType | APBaseType[];
