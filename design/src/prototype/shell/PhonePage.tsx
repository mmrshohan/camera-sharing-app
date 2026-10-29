import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import type { DeviceId, World, WorldEvent } from "@prototype/model/types";
import { reduce } from "@prototype/model/world";
import { isToPhone, nextSeq, reconcile, type Pending, type ToShell } from "./bridge";
import { DeviceHost } from "./DeviceHost";
import "./phone.css";

const isDeviceId = (id: string | undefined): id is DeviceId => id === "alex" || id === "sarah";

interface PhoneState {
  world: World;
  pending: Pending[];
  scale: number;
}

const send = (message: ToShell) => window.parent.postMessage(message, window.location.origin);

/** One phone in its own document, inside the review shell's iframe. */
export function PhonePage() {
  const { id } = useParams();
  const [state, setState] = useState<PhoneState | null>(null);
  const seq = useRef(0);
  /** The last event of this phone that the shell has applied, from its latest message. */
  const applied = useRef(0);

  useEffect(() => {
    if (!isDeviceId(id)) return;
    document.documentElement.classList.add("proto-phone-doc");
    const onMessage = (event: MessageEvent<unknown>) => {
      if (event.origin !== window.location.origin || event.source !== window.parent) return;
      const message = event.data;
      if (!isToPhone(message)) return;
      applied.current = message.applied;
      setState((current) => ({
        ...reconcile(message.world, message.applied, current?.pending ?? []),
        scale: message.scale,
      }));
    };
    window.addEventListener("message", onMessage);
    send({ kind: "ready", id });
    return () => window.removeEventListener("message", onMessage);
  }, [id]);

  // Chromium forgets an iframe's focused element when the shell takes focus. A phone keeps your
  // place, so the last focused control gets focus back when the phone does.
  useEffect(() => {
    let last: HTMLElement | null = null;
    const remember = (event: FocusEvent) => {
      if (event.target instanceof HTMLElement) last = event.target;
    };
    const restore = () =>
      requestAnimationFrame(() => {
        if (document.activeElement === document.body && last?.isConnected)
          last.focus({ preventScroll: true });
      });
    document.addEventListener("focusin", remember);
    window.addEventListener("focus", restore);
    return () => {
      document.removeEventListener("focusin", remember);
      window.removeEventListener("focus", restore);
    };
  }, []);

  // On a phone, tapping a button leaves the keyboard up; on a computer, a click takes focus from
  // the field, the keyboard drops, and the button moves away before the click lands.
  useEffect(() => {
    const keepTyping = (event: MouseEvent) => {
      const active = document.activeElement;
      const typing = active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement;
      if (typing && event.target instanceof Element && event.target.closest("button"))
        event.preventDefault();
    };
    document.addEventListener("mousedown", keepTyping, true);
    return () => document.removeEventListener("mousedown", keepTyping, true);
  }, []);

  const dispatch = useCallback(
    (event: WorldEvent) => {
      if (!isDeviceId(id)) return;
      seq.current = nextSeq(seq.current, applied.current);
      const pending = { seq: seq.current, event };
      // Shown at once; the shell confirms it with its next world.
      setState(
        (s) => s && { ...s, world: reduce(s.world, event), pending: [...s.pending, pending] },
      );
      send({ kind: "event", id, seq: pending.seq, event });
    },
    [id],
  );

  // Tells the shell the phone's true size, so it can fit both phones on the stage.
  const model = isDeviceId(id) ? state?.world.devices[id].model : undefined;
  const scale = state?.scale;
  const reported = useRef("");
  useLayoutEffect(() => {
    if (!isDeviceId(id) || !scale) return;
    const frame = document.querySelector<HTMLElement>(".device");
    if (!frame) return;
    const width = Math.round(frame.offsetWidth / scale);
    const height = Math.round(frame.offsetHeight / scale);
    const key = `${width}x${height}`;
    if (key === reported.current) return;
    reported.current = key;
    send({ kind: "size", id, width, height });
  }, [id, model, scale]);

  if (!isDeviceId(id) || !state) return null;
  return <DeviceHost id={id} world={state.world} dispatch={dispatch} scale={state.scale} />;
}
