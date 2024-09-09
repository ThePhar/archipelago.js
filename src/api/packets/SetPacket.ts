import { ClientPacketType } from "../enums/CommandPacketTypes.ts";
import { DataStorageOperation } from "../types/DataStorageOperations.ts";
import { JSONSerializableData } from "../types/JSONSerializableData.ts";

/**
 * Sent by the client to write data to the server's data storage, that data can then be shared across worlds or just
 * saved for later. Values for keys in the data storage can be retrieved with a {@link GetPacket}, or monitored with a
 * {@link SetNotifyPacket}.
 *
 * Additional arguments sent in this package will also be added to the {@link SetReplyPacket} it triggers.
 * @internal
 * @category Client Packets
 */
export interface SetPacket {
    readonly cmd: ClientPacketType.Set

    /** The default value to use in case the key has no value on the server. */
    readonly default: JSONSerializableData

    /** The key to manipulate. */
    readonly key: string

    /**
     * Operations to apply to the value, multiple operations can be present, and they will be executed in order of
     * appearance. See {@link DataStorageOperation} for information on supported operations.
     */
    readonly operations: DataStorageOperation[]

    /** If set, the server will send a {@link SetReplyPacket} back to the client. */
    readonly want_reply: boolean

    /** Additional arguments to be returned in {@link SetReplyPacket}. */
    readonly [p: string]: JSONSerializableData
}
