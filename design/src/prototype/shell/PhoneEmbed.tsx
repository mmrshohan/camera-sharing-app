import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import type { DeviceId, World, WorldEvent } from "@prototype/model/types";
import { isToShell, type ToPhone } from "./bridge";
import { assumedSize, useStage } from "./Stage";

/** One phone on the stage: its header and its own document, kept in step with the world. */
export function PhoneEmbed({
  id,
  name,
  world,
  applied,
  onEvent,
  header,
}: {
  id: DeviceId;
  name: string;
  world: World;
  /** The last event from this phone that `world` includes. */
  applied: number;
  onEvent: (seq: number, event: WorldEvent) => void;
  header: ReactNode;
}) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [ready, setReady] = useState(false);
  const { scale, sizes, report } = useStage();
  const size = sizes[id] ?? assumedSize;

  const latest = useRef<ToPhone>({ kind: "state", world, applied, scale });
  latest.current = { kind: "state", world, applied, scale };
  const post = () =>
    frame.current?.contentWindow?.postMessage(latest.current, window.location.origin);

  useEffect(() => {
    const onMessage = (event: MessageEvent<unknown>) => {
      if (event.origin !== window.location.origin || event.source !== frame.current?.contentWindow)
        return;
      const message = event.data;
      if (!isToShell(message) || message.id !== id) return;
      if (message.kind === "ready") {
        setReady(true);
        post();
      } else if (message.kind === "event") {
        onEvent(message.seq, message.event);
      } else if (message.kind === "key") {
        // The shell handles it as if it had been pressed here.
        window.dispatchEvent(new KeyboardEvent("keydown", { key: message.key }));
      } else {
        report(id, { width: message.width, height: message.height });
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [id, onEvent, report]);

  useLayoutEffect(() => () => report(id, null), [id, report]);

  useEffect(() => {
    if (ready) post();
  }, [ready, world, applied, scale]);

  return (
    <div className="proto-phone" data-ready={ready || undefined}>
      {header}
      <iframe
        ref={frame}
        className="proto-phone__frame"
        title={`${name}'s phone`}
        src={`${import.meta.env.BASE_URL}prototype/phone/${id}`}
        style={{ width: Math.ceil(size.width * scale), height: Math.ceil(size.height * scale) }}
      />
    </div>
  );
}
