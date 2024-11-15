import readline from "node:readline";

import { Client } from "./index";

// Using the node readline module, create an interface for intercepting any user input.
const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: false });

const client = new Client();

client.messages.on("message", (content) => {
    console.log(content);
});

// Add an event listener for when a "line" is entered into the standard input (e.g., the console/terminal window).
rl.on("line", (line) => {
    // Client.messages.say returns a promise once the same message is received back, so it's best to check for errors.
    client.messages.say(line)
        .catch(console.error);
});

client.login("archipelago.gg:59467", "Phar")
    .then(() => console.log("Connected to the Archipelago server!"))
    .catch(console.error);
