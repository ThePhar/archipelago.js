import { NetworkPlayer } from "./NetworkPlayer";
import { NetworkSlot } from "./NetworkSlot";

/**
 * An object that contains information about a player. Combination of {@link NetworkPlayer} and {@link NetworkSlot}.
 */
export type Player = NetworkPlayer & NetworkSlot;
