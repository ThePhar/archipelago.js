import { ArchipelagoSession } from "./ArchipelagoSession";

console.log("Hello, world");

const session = ArchipelagoSession.createSession("localhost:38281");
session.Connect();

// Make compiler happy.
export {};
