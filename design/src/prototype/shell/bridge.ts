// Each phone is its own document (an iframe), so its panels, focus and keyboard stay inside it,
// as on a real phone. The shell owns the world; phones send their events and get the world back.
import type { DeviceId, World, WorldEvent } from "@prototype/model/types";
import { reduce } from "@prototype/model/world";

/** An event a phone has applied locally and sent, not yet confirmed by the shell. */
export interface Pending {
  seq: number;
  event: WorldEvent;
}

/** The shell to a phone: the world, the last event of this phone it has applied, and the scale. */
export interface ToPhone {
  kind: "state";
  world: World;
  applied: number;
  scale: number;
}

/** A phone to the shell. */
export type ToShell =
  | { kind: "ready"; id: DeviceId }
  | { kind: "event"; id: DeviceId; seq: number; event: WorldEvent }
  | { kind: "size"; id: DeviceId; width: number; height: number };

const isRecord = (data: unknown): data is Record<string, unknown> =>
  typeof data === "object" && data !== null;

export const isToPhone = (data: unknown): data is ToPhone =>
  isRecord(data) && data.kind === "state";

export const isToShell = (data: unknown): data is ToShell =>
  isRecord(data) && (data.kind === "ready" || data.kind === "event" || data.kind === "size");

/**
 * The number of a phone's next event. A phone that reloads counts from 0 again while the shell
 * still holds its old count, so it carries on after that count: a lower number would look applied.
 */
export const nextSeq = (last: number, applied: number): number => Math.max(last, applied) + 1;

/**
 * The world a phone shows: the shell's world plus this phone's own events the shell hasn't
 * applied yet, so a tap or a keystroke shows at once and never flickers back.
 */
export function reconcile(
  world: World,
  applied: number,
  pending: readonly Pending[],
): { world: World; pending: Pending[] } {
  const left = pending.filter((p) => p.seq > applied);
  return { world: left.reduce((w, p) => reduce(w, p.event), world), pending: left };
}
