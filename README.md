# [Archipelago.JS](https://github.com/ThePhar/archipelago.js)

![GitHub](https://img.shields.io/github/license/thephar/archipelago.js?style=flat-square)
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/thephar/archipelago.js/Lint%20and%20Build?style=flat-square)
![npm type definitions](https://img.shields.io/npm/types/archipelago.js?style=flat-square)
![npm](https://img.shields.io/npm/v/archipelago.js?style=flat-square)
![npm](https://img.shields.io/npm/dm/archipelago.js?style=flat-square)

A general purpose library for communicating with Archipelago servers in Node.js or in the browser.

You can install it from npm or use a CDN to use it in browser.

-   NPM: `npm install @pharware/archipelago`

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

TODO: Rewrite the getting started.

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
