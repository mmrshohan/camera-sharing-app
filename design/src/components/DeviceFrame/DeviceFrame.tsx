import {
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type ReactNode,
  type Ref,
} from "react";
import { HomeIndicator } from "@components/HomeIndicator";
import { Keyboard } from "@components/Keyboard";
import { StatusBar } from "@components/StatusBar";
import { SurfaceScope } from "@shared/surface";
import type { DeviceModel } from "@shared/types";
import { tokens, type TextSize, type Theme } from "@tokens";
import { devices } from "./devices";
import "./DeviceFrame.css";

export interface DeviceFrameProps {
  model: DeviceModel;
  theme: Theme;
  textSize: TextSize;
  reduceMotion: boolean;
  children: ReactNode;
  screenRef?: Ref<HTMLDivElement>;
  scale?: number;
  /** Changing it means a new screen: the keyboard goes down in the same frame (D21). */
  routeKey?: string;
}

const typing = new Set(["text", "search", "email", "url", "tel", "password", "number"]);

function takesTyping(target: EventTarget | null): boolean {
  if (target instanceof HTMLTextAreaElement) return true;
  if (target instanceof HTMLInputElement) return typing.has(target.type);
  return target instanceof HTMLElement && target.isContentEditable;
}

const bezel = 12;
const homeButtonBezel = { top: 72, bottom: 88 };

/** A phone: its screen at true size, with status bar, cutout, bottom and keyboard. */
export function DeviceFrame({
  model,
  theme,
  textSize,
  reduceMotion,
  children,
  screenRef,
  scale = 1,
  routeKey,
}: DeviceFrameProps) {
  const spec = devices[model];
  const screen = useRef<HTMLDivElement | null>(null);
  const [keyboard, setKeyboard] = useState(false);
  const lastRoute = useRef(routeKey);

  // A new screen takes the keyboard down before the next paint.
  useLayoutEffect(() => {
    if (lastRoute.current === routeKey) return;
    lastRoute.current = routeKey;
    setKeyboard(false);
  }, [routeKey]);

  // A focused field can disappear without a blur event; check after every render.
  useLayoutEffect(() => {
    if (!keyboard) return;
    const active = document.activeElement;
    if (!screen.current?.contains(active) || !takesTyping(active)) setKeyboard(false);
  });

  const onFocus = (event: FocusEvent) => {
    if (takesTyping(event.target)) setKeyboard(true);
  };
  const onBlur = (event: FocusEvent) => {
    if (takesTyping(event.target) && !takesTyping(event.relatedTarget)) setKeyboard(false);
  };

  const homeButton = spec.bottom === "homeButton";
  const top = homeButton ? homeButtonBezel.top : bezel;
  const bottom = homeButton ? homeButtonBezel.bottom : bezel;
  const outer = { width: spec.width + bezel * 2, height: spec.height + top + bottom };
  const keyboardHeight = tokens.system.keyboardHeight[spec.platform];
  const screenStyle = {
    width: spec.width,
    height: spec.height,
    borderRadius: spec.cornerRadius,
    "--safe-top": `${spec.safeTop}px`,
    "--safe-bottom": `${spec.safeBottom}px`,
    "--keyboard-height-full": `${keyboardHeight + spec.safeBottom}px`,
    "--keyboard-inset": keyboard ? `${keyboardHeight + spec.safeBottom}px` : "0px",
  } as CSSProperties;

  return (
    <div className="device" style={{ width: outer.width * scale, height: outer.height * scale }}>
      <div
        className={`device__body device__body--${spec.bottom}`}
        style={{
          width: outer.width,
          height: outer.height,
          padding: `${top}px ${bezel}px ${bottom}px`,
          borderRadius: homeButton ? 44 : spec.cornerRadius + bezel,
          transform: scale === 1 ? undefined : `scale(${scale})`,
        }}
      >
        <SurfaceScope
          ref={(element: HTMLDivElement | null) => {
            screen.current = element;
            if (typeof screenRef === "function") screenRef(element);
            else if (screenRef) screenRef.current = element;
          }}
          surface={{
            platform: spec.platform,
            theme,
            textSize,
            reduceMotion,
            lowMemory: spec.memoryGb < 4,
          }}
          className="device__screen"
          data-keyboard={keyboard ? "up" : "down"}
          style={screenStyle}
          onFocus={onFocus}
          onBlur={onBlur}
        >
          <div className="device__content">{children}</div>
          <StatusBar model={model} />
          {spec.cutout.kind === "island" && (
            <span
              className="device__island"
              style={{ top: spec.cutout.top, width: spec.cutout.width, height: spec.cutout.height }}
              aria-hidden="true"
            />
          )}
          {spec.cutout.kind === "punchHole" && (
            <span
              className="device__punch-hole"
              style={{
                top: spec.cutout.top,
                width: spec.cutout.diameter,
                height: spec.cutout.diameter,
              }}
              aria-hidden="true"
            />
          )}
          <Keyboard platform={spec.platform} visible={keyboard} />
          {spec.bottom !== "homeButton" && <HomeIndicator kind={spec.bottom} />}
        </SurfaceScope>
        {homeButton && <span className="device__home-button" aria-hidden="true" />}
      </div>
    </div>
  );
}
