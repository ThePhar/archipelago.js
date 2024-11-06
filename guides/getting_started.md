---
title: Quick Start
group: Documents
category: Guides
---
# Quick Start Guide

## Pre-requisites

Before we begin, make sure you fulfil the following prerequisites:

* Have a basic understanding of JavaScript.
* Have installed a JavaScript runtime or web server for starting in the web browser.
* Have an Archipelago server to connect to.

## Installation

To start a new project with **archipelago.js**, you'll need to set up a project directory.

If you're using a runtime like **Node**, you can install **archipelago.js** by running the following command in your
project directory: `npm install archipelago.js`, then following the rest of this tutorial.

If you're looking to run this in a web browser without packaging as a part of a tool like **vite** or **webpack**, you
can add a `<script type="module">` tag to your HTML to write your JavaScript in and replace any mention of 
```js
import { /* ... */ } from "archipelago.js";
```
to
```js
import { /* ... */ } from "https://unpkg.com/archipelago.js/dist/archipelago.min.js";
// or any other path to archipelago.js as desired
``` 

as appropriate for your project and all the code examples will still work.

## Getting Started

To create a basic client that can listen for chat messages and print them to the console, you can use the following
example:

```js
import { Client } from "archipelago.js";

// Create a new instance of the Client class.
const client = new Client();

// Setup a listener for incoming chat messages and print them to the console.
client.messages.on("message", (message, sender) => {
    console.log(`${sender}: ${message}`);
});

// Connect to the Archipelago server (replace url, slot name, and game as appropriate for your scenario).
await client.login("wss://archipelago.gg:38281", "Phar", "Clique");

// Send a message after connecting.
client.messages.say("Hello, multiworld!")
```

Then, run this in your runtime of choice and see incoming messages print to console and your "Hello, multiworld!"
message get broadcast to all clients (and back to yourself).

## Listening for Server Events

You can also listen for events, such as when your client receives items from the server:

```js
// Setup a listener for whenever items are received and log the details.
client.items.on("itemsReceived", (items) => {
    for (const item of items) {
        console.log(`Received item ${item} from player ${item.sender}.`);
    }
});

// ... misc client code below ...
```

Or if another player changes their alias:

```js
// Setup a listener for when a player's alias (name) changes.
client.players.on("aliasUpdated", (_, oldAlias, newAlias) => {
    console.log(`${oldAlias} has changed their alias to ${newAlias}.`);
});

// ... misc client code below ...
```

Or if you're using the DeathLink mechanic and another player dies:

```js
// Setup a listener for when another DeathLink player dies.
client.deathLink.on("deathReceived", (source, time, cause) => {
    if (cause) {
        console.log(`DeathLink received from ${source}: ${cause}`);
        return;
    }
    
    // No cause was supplied.
    console.log(`DeathLink received from ${source}!`);
});

// ... misc client code below ...
```

## Sending Client Events

You can also inform the server of actions you take as a client, such as checking locations:

```js
// Mark a list of location ids as checked.
client.check(1001, 1002, 1003);
```

Updating keys in the data storage:

```js
// Add 1 to a data storage key.
client.storage
    .prepare("my_key", 0) /* 0 is the default if the key doesn't exist yet. */
    .add(1)
    .commit() // Commit changes.
```

Or sending your own DeathLinks to other players if you die.

```js
// Send a DeathLink to all DeathLink enabled players.
client.deathLink.sendDeathLink("Phar", "Phar spontanously combusted after pressing a large red button.");
```

## Conclusion

Congratulations! You are now a client developer and hopefully got a taste of what this library is capable of. For more
information, check out the rest of the API documentation for **archipelago.js** (Client might be a good one to start
with) and explore the available features.

If you encounter any issues or have any questions, you can reach out on the GitHub repository for support, or in the
[Archipelago Discord](https://discord.gg/8Z65BR2), specifically in this 
[thread](https://discord.com/channels/731205301247803413/1127258929357934662) once you've joined. Thanks for checking
out my little pet project for Archipelago!
