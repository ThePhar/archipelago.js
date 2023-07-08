import { DataStorageOperation } from "../types/DataStorageOperations.ts";
import { JSONSerializableData } from "../types/JSONSerializableData.ts";
import { BaseClientPacket } from "./BasePackets.ts";

/**
 * Sent by the client to write data to the server's data storage, that data can then be shared across worlds or just
 * saved for later. Values for keys in the data storage can be retrieved with a {@link GetPacket}, or monitored with a
 * {@link SetNotifyPacket}.
 *
 * Additional arguments sent in this package will also be added to the {@link SetReplyPacket} it triggers.
 *
 * @category Client Packets
 */
export interface SetPacket extends BaseClientPacket {
    readonly cmd: "Set";

    /** The key to manipulate. */
    readonly key: string;

    /** The default value to use in case the key has no value on the server. */
    readonly default: JSONSerializableData;

    /**
     * Operations to apply to the value, multiple operations can be present, and they will be executed in order of
     * appearance. See {@link DataStorageOperation} for information on supported operations.
     */
    readonly operations: DataStorageOperation[];

    /** If set, the server will send a {@link SetReplyPacket} back to the client. */
    readonly want_reply: boolean;
}
