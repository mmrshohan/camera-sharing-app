import { MaterialGlyph } from "@components/Icon";
import { devices } from "@components/DeviceFrame/devices";
import type { DeviceModel } from "@shared/types";
import "./StatusBar.css";

// iOS glyphs are drawn here as plain paths; SF Symbols artwork cannot ship in a public repository.
function IosSignal() {
  return (
    <svg
      className="status-bar__glyph"
      viewBox="0 0 17 12"
      width="17"
      height="12"
      aria-hidden="true"
    >
      {[4, 6.5, 9, 11.5].map((height, i) => (
        <rect key={i} x={i * 4.6} y={12 - height} width="3" height={height} rx="0.8" />
      ))}
    </svg>
  );
}

function IosWifi() {
  return (
    <svg
      className="status-bar__glyph"
      viewBox="0 0 16 12"
      width="16"
      height="12"
      aria-hidden="true"
    >
      <path d="M8 11.6 5.6 9.2a3.4 3.4 0 0 1 4.8 0Z" />
      <path d="M3.5 7.1a6.4 6.4 0 0 1 9 0l-1.2 1.2a4.7 4.7 0 0 0-6.6 0Z" />
      <path d="M1.3 4.9a9.5 9.5 0 0 1 13.4 0l-1.2 1.2a7.8 7.8 0 0 0-11 0Z" />
    </svg>
  );
}

function IosBattery() {
  return (
    <svg
      className="status-bar__glyph"
      viewBox="0 0 27 13"
      width="27"
      height="13"
      aria-hidden="true"
    >
      <rect
        x="0.5"
        y="0.5"
        width="23"
        height="12"
        rx="3.5"
        fill="none"
        stroke="currentColor"
        opacity="0.4"
      />
      <rect x="2" y="2" width="20" height="9" rx="2" />
      <rect x="25" y="4.5" width="1.5" height="4" rx="0.75" opacity="0.4" />
    </svg>
  );
}

export interface StatusBarProps {
  model: DeviceModel;
}

/** The phone's status bar at 9:41, drawn the way each platform draws it. Decoration only. */
export function StatusBar({ model }: StatusBarProps) {
  const spec = devices[model];
  const layout =
    spec.platform === "android" ? "android" : spec.cutout.kind === "none" ? "centered" : "ears";
  return (
    <div
      className={`status-bar status-bar--${layout}`}
      style={{ height: spec.statusBar }}
      aria-hidden="true"
    >
      {layout === "centered" ? (
        <>
          <span className="status-bar__side">
            <IosSignal />
            <IosWifi />
          </span>
          <span className="status-bar__time">9:41</span>
          <span className="status-bar__side status-bar__side--end">
            <IosBattery />
          </span>
        </>
      ) : layout === "ears" ? (
        <>
          <span className="status-bar__time">9:41</span>
          <span className="status-bar__side status-bar__side--end">
            <IosSignal />
            <IosWifi />
            <IosBattery />
          </span>
        </>
      ) : (
        <>
          <span className="status-bar__time">9:41</span>
          <span className="status-bar__side status-bar__side--end">
            <MaterialGlyph glyph="wifi" filled size={16} />
            <MaterialGlyph glyph="signal_cellular_alt" filled size={16} />
            <MaterialGlyph glyph="battery_full" filled size={16} />
          </span>
        </>
      )}
    </div>
  );
}
