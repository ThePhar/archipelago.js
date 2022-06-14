# Archipelago.js
![GitHub](https://img.shields.io/github/license/thephar/archipelago.js?style=flat-square) ![GitHub package.json version](https://img.shields.io/github/package-json/v/thephar/archipelago.js?style=flat-square) ![GitHub repo size](https://img.shields.io/github/repo-size/thephar/archipelago.js?style=flat-square) ![Discord](https://img.shields.io/discord/731205301247803413?label=discord&style=flat-square)

A general purpose library for communicating with Archipelago servers via Node.js.

## Getting Started

```javascript
import { ArchipelagoClient, NetworkVersion, SayPacket } from "archipelago.js";

// Set up our client.
const version = new NetworkVersion(0, 3, 2);
const client = new ArchipelagoClient("10.0.0.92:38281", version);

// Connect to the AP server and log in.
client.connect("CC", "Phar")
    // Send packets!
    .then(() => client.send(new SayPacket("Hello, world!")))
    .catch(console.error);

// Listen for packets.
client.addListener("packetReceived", (packet) => {
    console.log(packet);
});
```

The `ArchipelagoClient` handles all the main interactions with the Archipelago server, including sending and receiving packets and maintaining the websocket connection.

Currently, there are no helper functions to assist in most tasks, so a lot of the functionality still requires manual listening to certain packets and handling them accordingly.

This library is still in development so more features will be coming to make developing with this library easier.

### Written in TypeScript

This application was written in TypeScript and thus has access to all the type information of each packet and its parts. You can still load this application in vanilla JavaScript if you prefer, though and still have access to type information.