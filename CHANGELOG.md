## 0.2.1

Misc Changes:

- Changes to .npmignore to ignore development files.

## 0.2.0

Features:

- Added specialized events for each type of server packet the client can receive that implementers can subscribe to via `ArchipelagoClient.addListener()`:
  - `packetReceived`
  - `bounced`
  - `connected`
  - `connectionRefused`
  - `dataPackage`
  - `invalidPacket`
  - `locationInfo`
  - `printJSON`
  - `print`
  - `receivedItems`
  - `retrieved`
  - `roomInfo`
  - `roomUpdate`
  - `setReply`

- When connected to the Archipelago server, the `ArchipelagoClient` will fire a `GetDataPackage` packet to update its data package cache.
- Added `DataManager` object to `ArchipelagoClient` that automatically listens for `DataPackage` packets and updates its cache accordingly.

API Changes:

- Converted client packet classes into interfaces.
- Connecting to the Archipelago server via `ArchipelagoClient.connect()` does not resolve the promise until completely connected to the room or if the websocket fails to connect or server refuses the connection.

Misc Changes:

- Moved all source files into a `src` directory.

## 0.1.6

Features:

- Made `password` optional argument when connecting via `ArchipelagoClient.connect()`.

## 0.1.5

Features:

- Implicitly determines type of packet when comparing `cmd` property on a packet.

## 0.1.4

Bug Fixes

- Added basic validation for server address.
- Removed debug console.log that got forgotten about.

## 0.1.3

Bug Fixes

- Fixed a module lookup bug that prevented modules from being found if archipelago.js was imported via node_modules.

## 0.1.2

Bug Fixes:

- Changes to automation suite, which can cause issues with 0.1.1.

## 0.1.1

Bug Fixes:

- Fixed references and included type definitions from TypeScript build.

## 0.1.0

Initial release.

Features:

- Ability to create Archipelago client and connect to Archipelago server.
- Ability to listen to packet received events.
- Ability to send custom packets to server.
- Ability to disconnect manually from server.
