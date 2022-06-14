# Archipelago.js
![GitHub](https://img.shields.io/github/license/thephar/archipelago.js?style=flat-square)
![npm](https://img.shields.io/npm/v/archipelago.js?style=flat-square)
![npm type definitions](https://img.shields.io/npm/types/archipelago.js?style=flat-square)
![npm](https://img.shields.io/npm/dm/archipelago.js?style=flat-square)

A general purpose library for communicating with Archipelago servers via Node.js.

## Getting Started

```javascript
import { ArchipelagoClient, NetworkVersion } from "archipelago.js";

// Set up our client.
const version = new NetworkVersion(0, 3, 2);
const client = new ArchipelagoClient("10.0.0.92:38281", version);

// Connect to the Archipelago server!
client
    .connect("Archipelago", "Test")
    .then(() => {
        // Send a client packet!
        client.send({ cmd: "Say", text: "Hello world!" });
    })
    .catch(console.error);

// Listen for events!
client.addListener("print", (packet) => {
    console.log(packet.text);
});
```

The `ArchipelagoClient` handles all the main interactions with the Archipelago server, including sending and receiving 
packets and maintaining the websocket connection.

This library is still in development so more features will be coming to make developing with this library easier.

### Written in TypeScript

This application was written in TypeScript and thus has access to all the type information of each packet and its parts.
You can still load this application in vanilla JavaScript if you prefer, though and still have access to type 
information.
