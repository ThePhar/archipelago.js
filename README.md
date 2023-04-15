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
const { ArchipelagoClient, ItemsHandlingFlags } = require("archipelago.js");

// Set up the AP client.
const client = new ArchipelagoClient();
const credentials = {
    game: "Clique",
    name: "Phar",
    version: { major: 0, minor: 4, build: 0 },
    items_handling: ItemsHandlingFlags.REMOTE_ALL,
};

// Connect to the Archipelago server.
client
    .connect(credentials, "archipelago.gg", 38281)
    .then(() => {
        console.log(`Connected to room with ${client.data.players.size} players.`);

        // Say something!
        client.say("Hello, everyone!");
    })
    .catch(console.error);

// Listen for events, like `printJSON` packets.
client.addListener("printJSON", (_, message) => console.log(message));
```

### TypeScript

It's easy to also import **Archipelago.JS** into your TypeScript projects, as it contains full type definitions. Run 
`npm install archipelago.js` to include it in your TypeScript file. You can even include the structure of the slot data
for additional typing assistance.

Here's the same client example code as above, but note the ES-style import syntax.

```typescript
import { ArchipelagoClient, SlotCredentials, ItemsHandlingFlags } from ".";

// Define the structure of your slot data and you can have typing information on `client.data.slotData`.
type CliqueSlotData = {
    hard_mode: boolean;
}

// Set up the AP client.
const client = new ArchipelagoClient<CliqueSlotData>();
const credentials: SlotCredentials = {
    game: "Clique",
    name: "Phar",
    version: { major: 0, minor: 4, build: 0 },
    items_handling: ItemsHandlingFlags.REMOTE_ALL,
};

// Connect to the Archipelago server.
client
    .connect(credentials, "archipelago.gg", 38281)
    .then(() => {
        console.log(`Connected to room with ${client.data.players.size} players.`);
        console.log(`You're ${client.data.slotData.hard_mode ? "" : "not"} playing on hard mode!`);

        // Say something!
        client.say("Hello, everyone!");
    })
    .catch(console.error);

// Listen for packet events.
client.addListener("printJSON", (_, message) => console.log(message));
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
        // Pull objects from the `archipelagoJS` global.
        const { ArchipelagoClient, ItemsHandlingFlags } = archipelagoJS;

        // Set up the AP client.
        const client = new ArchipelagoClient();
        const credentials = {
            game: "Clique",
            name: "Phar",
            version: { major: 0, minor: 4, build: 0 },
            items_handling: ItemsHandlingFlags.REMOTE_ALL,
        };

        // Connect to the Archipelago server.
        client.connect(credentials, "archipelago.gg", 38281)
            .then(() => {
                console.log(`Connected to room with ${client.data.players.size} players.`);

                // Say something!
                client.say("Hello, everyone!");
            })
            .catch(console.error);

        // Listen for events, like `printJSON` packets.
        client.addListener("printJSON", (_, message) => console.log(message));
    </script>
</body>
</html>
```

## Some Helpful Manager Classes

### LocationsManager

The `locations` property on an `ArchipelagoClient` can be used to look up the name of a location from the data package,
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
client.locations.scout(CreateAsHint.NO_HINT, 90003, 90004); // Do not hint.
client.locations.scout(CreateAsHint.HINT_ONLY_NEW, 90005) // Hint this location, if new!

// Get the name of a location by its id.
console.log(client.locations.name(90010));
```

### ItemsManager

The `items` property on an `ArchipelagoClient` can be used to look up the name of an item from the data package.

```javascript
// Get the name of a item by its id.
console.log(client.items.name(90001));
```

### PlayersManager

The `players` property on an `ArchipelagoClient` can be used to look up the name or alias of a player from the data 
package.

```javascript
// Get the name of a player by their id.
console.log(client.players.name(1)); // Always their slot name.
console.log(client.players.alias(2)); // Their current alias.
```

### DataManager

The `data` property on an `ArchipelagoClient` can be used for seeing current data about the room or to send `Set`
operations to the server.

```javascript
// Get data package contents.
console.log(client.data.package);

// Get some basic server information.
console.log(client.data.hintCost);
console.log(client.data.hintPoints);
console.log(client.data.slot);
console.log(client.data.seed);

// Get slot data information from connection.
console.log(client.data.slotData);

// Send set operations to the server, and listen for responses if `want_reply`.
const setOperation = SetOperationsBuilder("pharcoins", 0, true)
    .add(5)
    .multiply(2)
    .shiftLeft(1);

const reply = await client.data.set(setOperation);
console.log(reply);
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
