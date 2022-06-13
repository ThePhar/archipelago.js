import { BasePacket } from "@packets";

export class SayPacket implements BasePacket {
    public readonly cmd = "Say";
    public readonly text: string;

    public constructor(text: string) {
        this.text = text;
    }
}
