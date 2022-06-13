import { ArchipelagoSession } from "./ArchipelagoSession";
import { NetworkVersion } from "./interfaces";
import { SayPacket } from "./interfaces/packets";

console.log("Hello, world");

const session = ArchipelagoSession.createSession("localhost:38281");
session.connect("Archipelago", "Test2", "", new NetworkVersion(0, 3, 2)).then(() => {
    session.send({ cmd: "Say", text: "Hello, there!" } as SayPacket);
});

// Make compiler happy.
export {};
