# [Archipelago.JS](https://github.com/ThePhar/archipelago.js)

![GitHub](https://img.shields.io/github/license/thephar/archipelago.js?style=flat-square)
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/thephar/archipelago.js/Lint%20and%20Build?style=flat-square)
![npm type definitions](https://img.shields.io/npm/types/archipelago.js?style=flat-square)
![npm](https://img.shields.io/npm/v/archipelago.js?style=flat-square)
![npm](https://img.shields.io/npm/dm/archipelago.js?style=flat-square)

> This is the developer documentation for the legacy 1.x branch, if you are looking for the developer documentation for 
> **2.0.0**, please change your version in the top right dropdown box to v2.0.
> 
> If you get a 404 error, please navigate to the front page (this page) and try again.

A general purpose library for communicating with Archipelago servers in Node.js or in the browser.

You can install it from npm or use a CDN to use it in browser.

-   NPM: `npm install archipelago.js`
-   CDN: `import { /* ... */ } from "https://unpkg.com/archipelago.js/dist/archipelago.min.js";` in a
    `<script type="module"></script>` block.

## Archipelago.js Node.js Quick Start Guide

Archipelago.js is a JavaScript library that runs in Node or the browser that allows you to connect to an Archipelago
server and communicate with it for your JavaScript-based games or tools. This guide will walk you through the process of
setting up a client and connecting to an Archipelago server.

### Prerequisites

Before you begin, make sure you have the following prerequisites:

-   Node.js installed on your machine.
-   Basic knowledge of JavaScript (or TypeScript).

### Installation

To start a new project with Archipelago.js follow these steps:

1. Create a new directory for your project.
2. Open a terminal or command prompt and navigate to the project directory.
3. Run the following command to initialize a new Node.js project: `npm install archipelago.js`.
4. If you plan to use TypeScript, also install typescript dependencies and nice to haves: `npm install -D typescript`.
    - Replace any instances of "`.js`" with "`.ts`" in this quick start guide.

### Getting Started

Follow the steps below to quickly set up a client and connect to an Archipelago server:

1. Create a new file called `client.js` in your project directory.
2. Open the `client.js` file with your preferred code editor and add the following code:

```js
// ES module import, but you can use CommonJS syntax as well, if you prefer.
import { Client, ITEMS_HANDLING_FLAGS } from "archipelago.js";

// Create a new instance of the Client class.
const client = new Client();

// Set up the connection information.
const connectionInfo = {
    hostname: "your-server-hostname", // Replace with the actual AP server hostname.
    port: 38281, // Replace with the actual AP server port.
    game: "your-game-name", // Replace with the game name for this player.
    name: "your-player-name", // Replace with the player slot name.
    items_handling: ITEMS_HANDLING_FLAGS.REMOTE_ALL,
};

// Connect to the Archipelago server
client
    .connect(connectionInfo)
    .then(() => {
        console.log("Connected to the server");
        // You are now connected and authenticated to the server. You can add more code here if need be.
    })
    .catch((error) => {
        console.error("Failed to connect:", error);
        // Handle the connection error.
    });
```

Make sure to replace "your-server-hostname", 38281, "your-game-name", "your-player-name", and set `items_handling` with
the appropriate values for your game and room.

Then just run your client script using `node client.js` or if you're using TypeScript: `npx ts-node client.ts`.

That's it! You have now set up a client and connected to an Archipelago server using archipelago.js. You can start
sending packets, handling server events, and building your multiplayer experience.

### Running in Browser

Archipelago.js can also run in the browser. Here's an example that works in most major browsers:

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <title>Archipelago.js Client Example</title>
    </head>
    <body>
        <script type="module">
            import {
                Client,
                ITEMS_HANDLING_FLAGS,
                SERVER_PACKET_TYPE,
            } from "https://unpkg.com/archipelago.js/dist/archipelago.min.js";

            // Create a new Archipelago client
            const client = new Client();

            const connectionInfo = {
                hostname: "your-server-hostname", // Replace with the actual AP server hostname.
                port: 38281, // Replace with the actual AP server port.
                game: "your-game-name", // Replace with the game name for this player.
                name: "your-player-name", // Replace with the player slot name.
                items_handling: ITEMS_HANDLING_FLAGS.REMOTE_ALL,
            };

            // Set up event listeners
            client.addListener(SERVER_PACKET_TYPE.CONNECTED, (packet) => {
                console.log("Connected to server: ", packet);
            });

            client.addListener(SERVER_PACKET_TYPE.ROOM_UPDATE, (packet) => {
                console.log("Room update: ", packet);
            });

            // Connect to the Archipelago server
            client
                .connect(connectionInfo)
                .then(() => {
                    console.log("Connected to the server");
                    // You are now connected and authenticated to the server. You can add more code here if need be.
                })
                .catch((error) => {
                    console.error("Failed to connect:", error);
                    // Handle the connection error.
                });

            // Disconnect from the server when unloading window.
            window.addEventListener("beforeunload", () => {
                client.disconnect();
            });
        </script>
    </body>
</html>
```

In this example, the Archipelago client is included as a script from the
https://unpkg.com/archipelago.js/dist/archipelago.min.js CDN. You can also use a locally hosted version of the library
if you prefer.

### Handling Server Events

You can listen for server events and handle them in your code. Here's an example of adding an event listener for the
"PrintJSON" event:

```js
import { /* ... */, SERVER_PACKET_TYPE } from "archipelago.js";

// Add an event listener for the PRINT_JSON event
client.addListener(SERVER_PACKET_TYPE.PRINT_JSON, (packet, message) => {
    console.log("Received a PrintJSON: ", message);
    // Add any additional logic here.
});
```

### Sending Client Events

You can also respond to the server at at time while you're connected. Here's a few examples of built-in events you can
send.

1. **Say**: Use the `say` method to send a normal chat message.

    ```ts
    client.say("Hello, archipelago!");
    ```

2. **Update Status**: Use the `updateStatus` method to update your status from **Ready** to **Playing** or even **Goal
   Complete**, once your game has completed.

    ```ts
    import { /* ... */, CLIENT_STATUS } from "archipelago.js";

    // See documentation for all possible statuses.
    client.updateStatus(CLIENT_STATUS.READY);
    client.updateStatus(CLIENT_STATUS.PLAYING);
    client.updateStatus(CLIENT_STATUS.GOAL);
    ```

3. **Send Raw Packets**: You can also just send raw packets to the server if none of the built-in methods work for your
   use cases. Be sure to add a listener for the response from the server though (see above)!

    ```ts
    import { /* ... */, CLIENT_PACKET_TYPE } from "archipelago.js";

    const syncPacket = {
        cmd: CLIENT_PACKET_TYPE.SYNC,
    }
    client.send(syncPacket);
    ```

### Player

Player objects returned from `PlayersManager` contain the following data and helper functions for easy item and location
name lookups:

-   `name`: The slot name for this player.
-   `alias`: The aliased name for this player.
-   `slot`: The slot number for this player.
-   `team`: The team number for this player.
-   `game`: The name of the game this player is playing.
-   `type`: Whether this player is a spectator, actual player, or item link group.
-   `group_members`: If this player is an item link group, this is the ids of all players that belong to this group.
-   `item(itemId)`: A function that returns the name for a given item id in the game of this player.
    -   Example: `const itemName = player.item(1000);`
-   `location(locationId)`: A function that returns the name for a given location id in the game of this player.
    -   Example: `const locationName = player.location(1000);`

### LocationsManager

The `LocationsManager` class in archipelago.js provides functionality for managing locations within the game. Here are
some tips for working with the `LocationsManager`:

1. **Check Locations**: Use the `check` method to mark locations as found. Pass the location IDs as arguments to the
   method.

    ```ts
    client.locations.check(locationId1, locationId2, locationId3);
    ```

2. **Scout Locations**: Use the `scout` method to scout locations without marking them as found. You can also create
   hints for these locations by passing the `CREATE_AS_HINT_MODE` as the first argument followed by the location IDs.

    ```ts
    client.locations.scout(CREATE_AS_HINT_MODE.NO_HINT, locationId1, locationId2, locationId3);
    ```

3. **Retrieve Location Name**: Use the `name` method to retrieve the name of a location based on its ID and game name.
   If the location or game is not found, it will return an "Unknown Location" string instead.

    ```ts
    const locationName = client.locations.name("your-game-name", locationId);
    ```

4. **Retrieve Location Group**: Use the `group` method to retrieve an array of location names belonging to a specific
   group in a game. If the game or group is not found, it will return an empty array.

    ```ts
    const locationGroup = client.locations.group("your-game-name", "group-name");
    ```

5. **Automatically Release All Locations**: Use the `autoRelease` method to send all missing locations as checked.

    ```ts
    client.locations.autoRelease();
    ```

### PlayersManager

The `PlayersManager` class in archipelago.js provides functionality for managing and looking up player data within the
game. Here are some helpful methods for working with the `PlayersManager`:

1. **Retrieve Player Name**: Use the `name` method to retrieve the name of a player based on their ID. If the player is
   not found, it will throw an error.

    ```ts
    const playerName = client.players.name(playerId);
    ```

2. **Retrieve Player Alias**: Use the `alias` method to retrieve the alias of a player based on their ID. If the player
   is not found, it will throw an error.

    ```ts
    const playerAlias = client.players.alias(playerId);
    ```

3. **Retrieve Player Game**: Use the `game` method to retrieve the game name of a player based on their ID. If the
   player is not found, it will throw an error.

    ```ts
    const playerGame = client.players.game(playerId);
    ```

4. **Retrieve Group Members**: Use the `members` method to retrieve an array of player IDs belonging to an item links
   group. If the id is of someone who is not an item links group or the group is not found, it will return an empty
   array.

    ```ts
    const groupMembers = client.players.members(groupId);
    ```

5. **Retrieve all Players**: Use the `all` method to return an array of all `Player` objects that are in this room.

    ```ts
    const players = client.players.all;
    ```

6. **Retrieve a specific Player**: Use the `get` method to return a `Player` object with that id. Returns `undefined` if
   player does not exist.

    ```ts
    const playerOne = client.players.get(1);
    ```

**Special Cases**: The methods in PlayersManager handle some special cases. For example, if the player ID is `0`, it
represents the server (Archipelago), and the methods will return appropriate values for these cases. See documentation
for full exceptions.

### DataManager

The `DataManager` class in archipelago.js is responsible for managing room session data and the data package. Here are
some tips for working with the `DataManager`:

1. **Retrieve Games List**: Use the `games` property to get an array of all games present in the room.

    ```ts
    const gamesList = client.data.games;
    ```

2. **Retrieve Hint Cost**: Use the `hintCost` property to get the number of hint points required to receive a hint.

    ```ts
    const hintCost = client.data.hintCost;
    ```

3. **Retrieve Hint Points**: Use the `hintPoints` property to get the number of hint points the player has.

    ```ts
    const hintPoints = client.data.hintPoints;
    ```

4. **Retrieve Slot Data**: Use the `slotData` property to access the slot data for the game.

    ```ts
    const slotData = client.data.slotData;
    ```

5. **Retrieve Slot and Team**: Use the `slot` and `team` properties to get the player's slot and team.

    ```ts
    const slot = client.data.slot;
    const team = client.data.team;
    ```

6. **Retrieve Seed**: Use the `seed` property to get the seed for the room.

    ```ts
    const seed = client.data.seed;
    ```

7. **Retrieve Permissions**: Use the `permissions` property to get the current permissions for the room.

    ```ts
    const permissions = client.data.permissions;
    ```

8. **Send Set Operations**: Use the `set` method to send a series of set operations using the `SetOperationBuilder`
   object to the server. This method returns a promise that resolves with a `SetReplyPacket` if `wantReply` was
   requested.

    ```ts
    import { /* ... */, SetOperationsBuilder } from "archipelago.js";

    // Add additional set operations to the SetOperationBuilder.
    const setOperation = new SetOperationsBuilder("key", 0 /* default value */, true /* wantReply */)
        .add(12) // Add to it!
        .multiply(4) // Multiply it!
        .shiftLeft(2); // Shift bits!

    const setReply = await client.data.set(setOperation);
    ```

### ItemsManager

The `ItemsManager` class in archipelago.js is responsible for managing item data. Here are some tips for working with
the `ItemsManager`:

1.  **Retrieve Item Name**: Use the name method to retrieve the name of an item based on its ID and game name. If the
    item or game is not found, it will return a default message.

    ```ts
    const itemName = client.items.name(gameName, itemId);
    ```

2.  **Retrieve Item ID**: Use the `id` method to retrieve the ID of an item based on its name and game name. If the item
    or game is not found, it will throw an error.

    ```ts
    const itemId = client.items.id(gameName, itemName);
    ```

3.  **Retrieve Item Group**: Use the `group` method to retrieve an array of item names belonging to a specific group in
    a game. If the game or group is not found, it will return an empty array.

    ```ts
    const itemGroup = client.items.group(gameName, groupName);
    ```

4.  **Retrieve all received items**: Use the `received` property to retrieve an array of all items that have been sent
    by the server.

    ```ts
    const allItems = client.items.received;
    ```

5.  **Retrieve ReceivedItem index**: Returns the `index` of the next expected item to be received from the server. Any
    items with a lower index are stored in `ItemsManager.received`. Useful for tracking if new items have been received
    or to check if a de-sync event occurred.

    ```ts
    const receivedItemIndex = client.items.index;
    ```

### HintsManager

The `HintsManager` class in archipelago.js is responsible for managing hint events for a specific player slot. Here are
some tips for working with the `HintsManager`:

1. **Get Relevant Hints**: Use the `mine` property to access an array of hints that are relevant to the player slot.

```ts
const relevantHints = client.hints.mine;
```

Hints update automatically for the slot the player is in when new hints are made that are relevant for the player.

### Conclusion

Congratulations! You have successfully set up a client and hopefully learned a good amount of what this library is
capable of! You are now ready to integrate Archipelago functionality into your application.

For more information, check out the archipelago.js API documentation and explore the available features and
capabilities.

If you encounter any issues or have questions, feel free to reach out on the GitHub repository for support or directly
to Phar (thephar) in the [Archipelago Discord](https://discord.gg/8Z65BR2), and thanks for checking out my little pet
project for Archipelago!

## Contributing / Development

To develop further or contribute to **Archipelago.JS** itself, just clone this repository to a desired location on your
computer:

```
git clone https://github.com/ThePhar/archipelago.js && cd archipelago.js
```

Then run `npm install` to install all dependencies.

**Archipelago.JS** is written in TypeScript and includes a strong ESLint and Prettier config file to ensure code
consistency. Be sure to follow the code standards and check your work with `npm run lint`. You can build your code by
running `npm run pack` (to package in a `.tgz` file) or `npm run build` (for a full `dist/` folder).

It is recommended to work in a branch other than `main`, even if you fork, to avoid merge conflicts with GitHub when
pull requests and squash merges happen.

## API Documentation & Other Links

The full API documentation is located [here](https://thephar.github.io/archipelago.js/). Please be sure to reference it,
while you are developing your JavaScript-based clients.

This library supports 100% of the Archipelago network protocol referenced at
[here](https://github.com/ArchipelagoMW/Archipelago/blob/main/docs/network%20protocol.md) as of **2023-07-08**. See more
information about [Archipelago](https://archipelago.gg) at their website.
