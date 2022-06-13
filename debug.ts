import { ArchipelagoClient } from "./ArchipelagoClient";
import { NetworkVersion } from "./structs";
import { SayPacket } from "./packets";

console.log("Hello, world");

const client = new ArchipelagoClient("localhost:38281", new NetworkVersion(0, 3, 2));
client.connect("Archipelago", "Test", "").then(() => {
    client.send({ cmd: "Say", text: "Hello, there!" } as SayPacket);
});

// Make compiler happy.
export {};
