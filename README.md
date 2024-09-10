# Archipelago JS Library (Archipelago.JS)

![GitHub License](https://img.shields.io/github/license/thephar/archipelago.js?style=flat-square)
![NPM Version](https://img.shields.io/npm/v/%40pharware%2Farchipelago?style=flat-square)
![JSR Version](https://img.shields.io/jsr/v/%40pharware/archipelago?style=flat-square)
![NPM Downloads](https://img.shields.io/npm/dm/%40pharware%2Farchipelago?style=flat-square)
![Static Badge](https://img.shields.io/badge/bsky-%40pharware.com-gray?style=flat-square&labelColor=%233b78fc&link=https%3A%2F%2Fbsky.app%2Fprofile%2Fpharware.com)

A runtime-agnostic and zero dependency TypeScript/JavaScript library for communicating with Archipelago servers. 

Works on all major desktop and mobile browsers ([Firefox](https://www.mozilla.org/en-US/firefox/), 
[Chromium](https://www.chromium.org/), and [Safari](https://www.apple.com/safari/)) and server-side runtimes such as 
[Node.js](https://nodejs.org/en), [Bun](https://bun.sh/), and [Deno](https://deno.com/).

## Installation

In your project directory, run one of the following commands to install the library to your project as a dependency:

### Node

npm: `npm install @pharware/archipelago`

yarn: `yarn add @pharware/archipealgo`

pnpm: `pnpm add @pharware/archipelago`

### Bun

bun: `bun add @pharware/archipelago`

### Deno

deno: `deno add @pharware/archipelago`

### Browser

    // TODO: Write.

## Basic Usage

```js
import { ArchipelagoClient } from "@pharware/archipelago";

// Create a client.
const client = new ArchipelagoClient();

// Connect and authenticate.
await client.connect("wss://archipelago.gg:38281");
await client.authenticate("Phar", "Clique");
```

## Documentation

    // TODO: Rewrite this whole section.

## Contribution

    // TODO: Rewrite this whole section.
