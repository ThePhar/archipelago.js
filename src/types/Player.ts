import { NetworkPlayer } from "./NetworkPlayer.ts";
import { NetworkSlot } from "./NetworkSlot.ts";

/**
 * An object that contains information about a player. Combination of {@link NetworkPlayer} and {@link NetworkSlot}.
 */
export type Player = NetworkPlayer & NetworkSlot;
