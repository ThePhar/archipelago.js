# [Archipelago.JS](https://github.com/ThePhar/archipelago.js)
![GitHub](https://img.shields.io/github/license/thephar/archipelago.js?style=flat-square)
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/thephar/archipelago.js/Lint%20and%20Build?style=flat-square)
![npm type definitions](https://img.shields.io/npm/types/archipelago.js?style=flat-square)
![npm](https://img.shields.io/npm/v/archipelago.js?style=flat-square)
![npm](https://img.shields.io/npm/dm/archipelago.js?style=flat-square)

A general purpose library for communicating with Archipelago servers in Node.js or in the browser.

**Note: This library is currently in active development and some key APIs may change between 0.x releases. __Use this
library at your own risk.__**

## Getting Started

### Node.js - JavaScript

Run `npm install archipelago.js` to add **Archipelago.JS** to your Node.js project.

Here is an example client that connects and sends a hello message on connection. It also updates the console when a new
message comes in.

```javascript
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

### TypeScript

It's easy to also import **Archipelago.JS** into your TypeScript projects, as it contains full type definitions. Run 
`npm install archipelago.js` to include it in your TypeScript file.

Here's the same client example code as above, but note the ES-style import syntax.

```typescript
import { ArchipelagoClient, CommandPacketType, ItemsHandlingFlags } from "archipelago.js";

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

// Listen for packet events.
client.addListener("print", (packet) => packet.text);

```

### In the Browser

**Archipelago.JS** can also run in the browser using the WebSocket API. Download the `archipelago.min.js` file and
include it with your web-based project. Then you can use it in your HTML/Javascript via the `archipealgoJS` global 
variable.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Example</title>
</head>
<body>
    <p>Open the console in your browser to see the output!</p>

    <script src="archipelago.min.js"></script>
    <script>
        const { ArchipelagoClient, CommandPacketType, ItemsHandlingFlags } = archipelagoJS;

        // Set up the AP client.
        const client = new ArchipelagoClient("10.0.0.92:38281");
        const credentials = {
            game: "ChecksFinder",
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

        // Listen for packet events.
        client.addListener("print", (packet) => packet.text);
    </script>
</body>
</html>
```

## Some Helpful Manager Classes

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

## Contributing / Development

To develop further or contribute to **Archipelago.JS** itself, just clone this repository to a desired location on your
computer:

```
git clone https://github.com/ThePhar/archipelago.js && cd archipelago.js
```

Then run `npm install` to install all dependencies.

**Archipelago.JS** is written in TypeScript and includes a string ESLint and Prettier config file to ensure code
consistency. Be sure to follow the code standards and check your work with `npm run lint`. You can build your code by 
running `npm run pack` (to package in a `.tgz` file) or `npm run build` (for a full `dist/` folder).

It is recommended to work in a branch other than `main`, even if you fork, to avoid merge conflicts with GitHub when
pull requests and squash merges happen.

## API Documentation & Other Links

The full API documentation is located [here](https://thephar.github.io/archipelago.js/). Please be sure to reference it, while
you are developing your JavaScript-based clients.

This library supports 100% of the Archipelago network protocol referenced [here](https://github.com/ArchipelagoMW/Archipelago/blob/main/docs/network%20protocol.md). See more information about 
[Archipelago](https://archipelago.gg) at their website.