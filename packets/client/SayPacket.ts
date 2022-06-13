import { CommandPacketType } from "@enums";
import { BasePacket } from "@packets";

export class SayPacket implements BasePacket {
    public readonly cmd = CommandPacketType.SAY;
    public readonly text: string;

    public constructor(text: string) {
        this.text = text;
    }
}
