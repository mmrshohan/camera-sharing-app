import { people, wordSets } from "./fixtures";
import { limits } from "./timing";
import type { DeviceId, Session, SessionState, Words, World } from "./types";

/** Alex lends his camera; Sarah receives. */
export const roleOf = (id: DeviceId): "host" | "recipient" =>
  id === "alex" ? "host" : "recipient";

export function wordsFor(attempt: number): Words {
  const set = wordSets[(attempt - 1) % wordSets.length] ?? wordSets[0];
  if (!set) throw new Error("no verification words");
  return set;
}

/** A request waiting for both phones. */
export const isPending = (s: Session | null): s is Session =>
  s !== null && (s.state === "requested" || s.state === "verifying");

/** Only ended, expired or declined sessions make way for a new one (R1, R2). */
export const canStartNew = (s: Session | null): boolean =>
  s === null || s.state === "ended" || s.state === "expired" || s.state === "declined";

function nextSessionId(w: World): string {
  const ids = [
    w.session?.id,
    w.recovery?.sessionId,
    ...w.cloud.map((o) => o.sessionId),
    ...Object.values(w.devices).flatMap((d) => [
      ...d.hostPhotos.map((p) => p.sessionId),
      ...d.gallery.map((p) => p.sessionId),
    ]),
  ];
  const numbers = ids.map((id) => Number(/^s(\d+)$/.exec(id ?? "")?.[1] ?? 0));
  return `s${Math.max(0, ...numbers) + 1}`;
}

/** Alex asks to lend his camera to Sarah, by scanning her invitation or typing her username. */
export function createSession(
  w: World,
  state: Extract<SessionState, "requested" | "verifying">,
): Session {
  return {
    id: nextSessionId(w),
    attempt: 1,
    host: people.alex,
    recipient: people.sarah,
    words: wordsFor(1),
    state,
    approvals: { host: false, recipient: false, attempt: 1 },
    startedAt: null,
    endsAt: null,
    endedAt: null,
    expiresAt: w.clock + limits.requestMs,
  };
}

/** After a mismatch, a changed device, a decline or expiry: a new attempt with new words. */
export function restart(s: Session, clock: number): Session {
  const attempt = s.attempt + 1;
  return {
    ...s,
    attempt,
    words: wordsFor(attempt),
    state: "verifying",
    approvals: { host: false, recipient: false, attempt },
    expiresAt: clock + limits.requestMs,
  };
}

/** When an active session ends: two hours after it started, or 15 minutes after the last photo. */
export const endsAt = (s: Session, lastActivity: number): number =>
  Math.min((s.startedAt ?? lastActivity) + limits.sessionMs, lastActivity + limits.idleMs);

const takenUsernames = new Set(Object.values(people).map((p) => p.handle.slice(1)));

/** Why a username can't be used, or null. "taken" is only known after the server check. */
export function usernameProblem(value: string): "notAllowed" | "taken" | null {
  if (!/^[a-z][a-z0-9._]{2,19}$/.test(value)) return "notAllowed";
  return takenUsernames.has(value) ? "taken" : null;
}
