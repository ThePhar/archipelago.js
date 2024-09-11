import { ItemClassification } from "./consts/ItemClassification.ts";
import { ItemsHandlingFlags } from "./consts/ItemsHandlingFlags.ts";
import { ClientStatus } from "./enums/ClientStatus.ts";
import { CreateAsHintMode } from "./enums/CreateAsHintMode.ts";
import { Permission, PermissionTable } from "./enums/Permission.ts";
import { SlotType } from "./enums/SlotType.ts";
import { ConnectionError } from "./types/ConnectionError.ts";
import { DataPackage, GamePackage } from "./types/DataPackage.ts";
import { JSONSerializableData } from "./types/JSONSerializableData.ts";
import { NetworkHint } from "./types/NetworkHint.ts";
import { NetworkItem } from "./types/NetworkItem.ts";
import { NetworkPlayer } from "./types/NetworkPlayer.ts";
import { NetworkSlot } from "./types/NetworkSlot.ts";
import { NetworkVersion } from "./types/NetworkVersion.ts";

export {
    ClientStatus,
    CreateAsHintMode,
    ItemClassification,
    ItemsHandlingFlags,
    Permission,
    SlotType,
};

export type {
    ConnectionError,
    DataPackage,
    GamePackage,
    JSONSerializableData,
    NetworkHint,
    NetworkItem,
    NetworkPlayer,
    NetworkSlot,
    NetworkVersion,
    PermissionTable,
};

/**
 * A collection of network protocol packets that can be sent over the network and their types.
 * @namespace
 */
export * as NetworkPackets from "./packets";

/**
 * A collection of base data storage operation types for use in a {@link NetworkPackets.SetPacket}.
 * @namespace
 */
export * as DataStorageOperations from "./types/DataStorageOperations.ts";

/**
 * A collection of message part types for use in a {@link NetworkPackets.PrintJSONPacket}.
 * @namespace
 */
export * as JSONMessageParts from "./types/JSONMessagePart.ts";
