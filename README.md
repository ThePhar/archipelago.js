# Archipelago.js
![GitHub](https://img.shields.io/github/license/thephar/archipelago.js?style=flat-square)
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/thephar/archipelago.js/Lint%20and%20Build?style=flat-square)
![npm type definitions](https://img.shields.io/npm/types/archipelago.js?style=flat-square)
![npm](https://img.shields.io/npm/v/archipelago.js?style=flat-square)
![npm](https://img.shields.io/npm/dm/archipelago.js?style=flat-square)

A general purpose library for communicating with Archipelago servers via Node.js.

**Note: This library is currently in active development and some key APIs may change between 0.x releases. __Use this
library at your own risk.__**

## Getting Started

Install `archipelago.js` into your npm project with the following command:

```bash
npm install archipelago.js
```

Here is an example client that connects and sends a hello message on connection. It also updates the console when a new
message comes in.

```javascript
// CommonJS Modules
const { ArchipelagoClient, CommandPacketType, ItemsHandlingFlags } = require("archipelago.js");

// Set up the AP client.
const client = new ArchipelagoClient("localhost:38281");
const credentials = {
    game: "Rogue Legacy",
    name: "Phar",
    uuid: "8da62081-7213-4543-97f6-b54d40e2fe52",
    version: { major: 0, minor: 3, build: 2 },
    items_handling: ItemsHandlingFlags.REMOTE_ALL,
};

// Connect to the Archipelago server.
client
    .connect(credentials)
    .then(() => {
        console.log(`Connected to room with ${client.data.players.size} players.`);

        // Send a raw packet to the server!
        client.send({ cmd: CommandPacketType.SAY, text: "Hello, everybody!" });
    })
    .catch(console.error);

// Listen for events, like `print` packets.
client.addListener("print", (packet) => {
    console.log(packet.text);
});
```

The `ArchipelagoClient` handles all the main interactions with the Archipelago server, including sending and receiving 
packets and maintaining the websocket connection.

### LocationsManager

The `locations` property on a `ArchipelagoClient` can be used to look up the name of a location from the data package,
check or scout locations, or view a list of all locations checked or missing.

```javascript
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
```

### ItemsManager

The `items` property on a `ArchipelagoClient` can be used to look up the name of an item from the data package.

```javascript
// Get the name of a item by its id.
console.log(client.items.name(90001));
```

### PlayersManager

The `players` property on a `ArchipelagoClient` can be used to look up the name or alias of a player from the data 
package.

```javascript
// Get the name of a player by their id.
console.log(client.players.name(1)); // Always their slot name.
console.log(client.players.alias(2)); // Their current alias.
```

## API Documentation & Other Links

There is documentation in the GitHub pages section of this repository that includes all the available API. Please take
a look for more information.

This library supports 100% of the Archipelago network protocol referenced [here](https://github.com/ArchipelagoMW/Archipelago/blob/main/docs/network%20protocol.md). See more information about 
[Archipelago](https://archipelago.gg) at their website.