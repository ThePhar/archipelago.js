import { Client } from "./index.ts";

const client = new Client();

client.socket.on("AnyPacket", console.log);

await client.login("archipelago.gg:56639", "Phar", "Clique");
