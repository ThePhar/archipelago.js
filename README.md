# ![archipelago.js Icon](./assets/icon_small.png) archipelago.js

![GitHub License](https://img.shields.io/github/license/thephar/archipelago.js?style=flat-square)
![Types](https://img.shields.io/npm/types/archipelago.js?style=flat-square)
![NPM Version](https://img.shields.io/npm/v/archipelago.js?style=flat-square)
![NPM Downloads](https://img.shields.io/npm/dm/archipelago.js?style=flat-square)
![Static Badge](https://img.shields.io/badge/bsky-%40pharware.com-gray?style=flat-square&labelColor=%233b78fc&link=https%3A%2F%2Fbsky.app%2Fprofile%2Fpharware.com)

A runtime-agnostic and zero dependency TypeScript/JavaScript library for communicating with Archipelago servers. 

Targeted to work on all major desktop and mobile browsers ([Firefox](https://www.mozilla.org/en-US/firefox/), 
[Chromium](https://www.chromium.org/), and [Safari](https://www.apple.com/safari/)) and server-side runtimes such as 
[Node.js](https://nodejs.org/en), [Bun](https://bun.sh/), and [Deno](https://deno.com/).

## Installation

Install via `npm install archipelago.js` (or via your preferred package manager's flavor).

## Quick Start Guide

Check out the quick start documentation [here](https://archipelago.js.org/stable/documents/Quick_Start.html)!

## API Documentation

The full API documentation is located [here](https://thephar.github.io/archipelago.js/). Please be sure to reference it
while you are developing your JavaScript-based clients.

This library supports 100% of the Archipelago network protocol referenced 
[here](https://github.com/ArchipelagoMW/Archipelago/blob/main/docs/network%20protocol.md) as of **2024-11-03** 
(0.5.1 RC1). See more information about [Archipelago](https://archipelago.gg) at their website.

## Contribution

Archipelago.js is built using TypeScript and the Bun bundler. You can set up your development environment  by cloning 
this repository to a desired location on your computer and installing its devDependencies.

```bash
git clone https://github.com/ThePhar/archipelago.js
cd archipelago.js
npm install # or pnpm install
```

Then to build, have [Bun](https://bun.sh/) installed and run `npm run build` (or `pnpm build`).

**Archipelago.js** is written in TypeScript and includes a strong ESLint config file to ensure code consistency. Be sure
to follow the code standards of this repository and check your work with `npm run lint`.

### Disclaimer / Call for Help

Currently, there are no automated tests for this library, so all testing in browser, Node, Deno, and Bun are done 
manually. This is certainly one area that can be expanded upon.

Alternatively, expanding upon the documentation (either through the JSDoc or tutorial-like guides) would be appreciated. 
