# Archipelago.js
![GitHub](https://img.shields.io/github/license/thephar/archipelago.js?style=flat-square)
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/thephar/archipelago.js/Lint%20and%20Build?style=flat-square)
![npm type definitions](https://img.shields.io/npm/types/archipelago.js?style=flat-square)
![npm](https://img.shields.io/npm/v/archipelago.js?style=flat-square)
![npm](https://img.shields.io/npm/dm/archipelago.js?style=flat-square)

A general purpose library for communicating with Archipelago servers via Node.js.

## Getting Started

```javascript
import { ArchipelagoClient, NetworkVersion } from "archipelago.js";

// Set up our client.
const version = new NetworkVersion(0, 3, 2);
const client = new ArchipelagoClient("localhost:38281", version);

// Connect to the Archipelago server!
client
    .connect("Archipelago", "YourName1")
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

### LocationsManager

The `locations` property on a `ArchipelagoClient` can be used to look up the name of a location from the data package,
check or scout locations, or view a list of all locations checked or missing.

```javascript
import { ArchipelagoClient, NetworkVersion } from "archipelago.js";

const version = new NetworkVersion(0, 3, 2);
const client = new ArchipelagoClient("localhost:38281", version);

client
    .connect("Rogue Legacy", "Phar", "", ["DeathLink"], 0b111)
    .then(() => {
        // See a list of all locations checked or not checked.
        console.log(client.locations.checked);
        console.log(client.locations.missing);

        // Await location info.
        client.addListener("locationInfo", (packet) => {
            console.log(packet.locations);
        });

        // Check locations. Data will return on "locationInfo" event if ItemHandlingFlags are set.
        client.locations.check(90000, 90001, 90002); // As many ids as you want.

        // Scout locations without checking them. Data will return on "locationInfo" event.
        client.locations.scout(false, 90003, 90004); // Do not hint.
        client.locations.scout(true, 90005) // Hint this location.

        // Get the name of a location by its id.
        console.log(client.locations.name(90010));
    });
```

### ItemsManager

The `items` property on a `ArchipelagoClient` can be used to look up the name of an item from the data package.

```javascript
import { ArchipelagoClient, NetworkVersion } from "archipelago.js";

const version = new NetworkVersion(0, 3, 2);
const client = new ArchipelagoClient("localhost:38281", version);

client
    .connect("Rogue Legacy", "Phar", "", ["DeathLink"], 0b111)
    .then(() => {
        // Get the name of a item by its id.
        console.log(client.items.name(90001));
    });
```

### PlayersManager

The `players` property on a `ArchipelagoClient` can be used to look up the name or alias of a player from the data 
package.

```javascript
import { ArchipelagoClient, NetworkVersion } from "archipelago.js";

const version = new NetworkVersion(0, 3, 2);
const client = new ArchipelagoClient("localhost:38281", version);

client
    .connect("Rogue Legacy", "Phar", "", ["DeathLink"], 0b111)
    .then(() => {
        // Get the name of a player by their id.
        console.log(client.players.name(1)); // Always their slot name.
        console.log(client.players.alias(2)); // Their current alias.
    });
```

### DataManager

The `data` property on a `ArchipelagoClient` can be used to look at the raw data in the data package or in the room 
itself.

```javascript
import { ArchipelagoClient, NetworkVersion } from "archipelago.js";

const version = new NetworkVersion(0, 3, 2);
const client = new ArchipelagoClient("localhost:38281", version);

client
    .connect("Rogue Legacy", "Phar", "", ["DeathLink"], 0b111)
    .then(() => {
        // Get the raw datapackage map.
        console.log(client.data.package);   // Map<string, GameData>
        
        // Get the look up map for locations/items/players.
        console.log(client.data.locations); // Map<number, string>
        console.log(client.data.items);     // Map<number, string>
        console.log(client.data.players);   // Map<number, NetworkPlayer>
    });
```

## Written in TypeScript

This application was written in TypeScript and thus has access to all the type information of each packet and its parts.
You can still load this application in vanilla JavaScript if you prefer, though and still have access to type 
information.
