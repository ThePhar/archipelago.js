import { ItemClassification } from "./consts/ItemClassification";
import { ItemsHandlingFlags } from "./consts/ItemsHandlingFlags";
import { ClientStatus } from "./enums/ClientStatus";
import { ClientPacketType, ServerPacketType } from "./enums/CommandPacketTypes";
import { ConnectionError } from "./enums/ConnectionError";
import { CreateAsHintMode } from "./enums/CreateAsHintMode";
import { PacketProblemType } from "./enums/PacketProblemType";
import { AutoPermission, Permission } from "./enums/Permission";
import { PrintJSONType } from "./enums/PrintJSONType";
import { SlotType } from "./enums/SlotType";
import * as NetworkPackets from "./packets";
import { ClientPacket, ServerPacket } from "./packets";
import { DataPackage, GamePackage } from "./types/DataPackage";
import * as DataStorageOperations from "./types/DataStorageOperations";
import { DeathLinkData } from "./types/DeathLinkData";
import * as JSONMessageParts from "./types/JSONMessagePart";
import { JSONSerializableData } from "./types/JSONSerializableData";
import { NetworkHint } from "./types/NetworkHint";
import { NetworkItem } from "./types/NetworkItem";
import { NetworkPlayer } from "./types/NetworkPlayer";
import { NetworkSlot } from "./types/NetworkSlot";
import { NetworkVersion } from "./types/NetworkVersion";
import { SlotData } from "./types/SlotData";

/**
 * A collection of constants, enums, interfaces, and types that are utilized by the Archipelago Network Protocol.
 * @namespace NetworkAPI
 * @internal
 */
export {
    AutoPermission,
    ClientPacketType,
    ClientStatus,
    ConnectionError,
    CreateAsHintMode,
    DataStorageOperations,
    ItemClassification,
    ItemsHandlingFlags,
    JSONMessageParts,
    NetworkPackets,
    PacketProblemType,
    Permission,
    PrintJSONType,
    ServerPacketType,
    SlotType,
};

/**
 * A collection of constants, enums, interfaces, and types that are utilized by the Archipelago Network Protocol.
 * @namespace NetworkAPI
 * @internal
 */
export type {
    ClientPacket,
    DataPackage,
    DeathLinkData,
    GamePackage,
    JSONSerializableData,
    NetworkHint,
    NetworkItem,
    NetworkPlayer,
    NetworkSlot,
    NetworkVersion,
    ServerPacket,
    SlotData,
};
