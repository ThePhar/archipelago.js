import { CommonTags } from "./consts/CommonTags";
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
export default {
    CommonTags,
    ItemClassification,
    ItemsHandlingFlags,
};

/**
 * A collection of constants, enums, interfaces, and types that are utilized by the Archipelago Network Protocol.
 * @namespace NetworkAPI
 * @internal
 */
export type {
    AutoPermission,
    ClientPacket,
    ClientPacketType,
    ClientStatus,
    ConnectionError,
    CreateAsHintMode,
    DataPackage,
    DataStorageOperations,
    DeathLinkData,
    GamePackage,
    JSONMessageParts,
    JSONSerializableData,
    NetworkHint,
    NetworkItem,
    NetworkPackets,
    NetworkPlayer,
    NetworkSlot,
    NetworkVersion,
    PacketProblemType,
    Permission,
    PrintJSONType,
    ServerPacket,
    ServerPacketType,
    SlotData,
    SlotType,
};
