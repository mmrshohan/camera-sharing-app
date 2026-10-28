import type { ReactNode } from "react";
import { MaterialGlyph } from "@components/Icon";
import { LiveDot } from "@components/LiveDot";
import { ProgressRing } from "@components/ProgressRing";
import { RingButton } from "@components/RingButton";
import { Shutter } from "@components/Shutter";
import { icons } from "@icons";
import { tokens } from "@tokens";

// The anatomy is drawn from the tokens at three times the real size.
const S = 3;
const { ringSize, ringStroke, ringGap, ringDisc, ringIcon, ringLabelGap } = tokens.shape;
const outer = (ringSize / 2) * S;
const disc = (ringDisc / 2) * S;
const icon = ringIcon * S;
const labelSize = tokens.type.ios.default.ringLabel.size * S;
const cx = 240;
const cy = 24 + outer;
const labelTop = cy + outer + ringLabelGap * S;
const width = 480;
const height = Math.round(labelTop + labelSize * 1.4);
const right = cx + outer + 70;
const left = cx - outer - 70;
const markerRadius = 12;

type Point = readonly [number, number];
const polar = (r: number, degrees: number): Point => [
  cx + r * Math.cos((degrees * Math.PI) / 180),
  cy + r * Math.sin((degrees * Math.PI) / 180),
];

const parts: { name: string; detail: string; point: Point; marker: Point }[] = [
  {
    name: "Ring",
    detail: `${ringSize} pt, with a ${ringStroke} pt accent stroke`,
    point: polar(outer - (ringStroke * S) / 2, -40),
    marker: [right, 40],
  },
  {
    name: "Gap",
    detail: `${ringGap} pt`,
    point: polar(disc + (ringGap * S) / 2, 200),
    marker: [left, cy - 32],
  },
  {
    name: "Disc",
    detail: `${ringDisc} pt: accent when filled, accentTint when tinted`,
    point: polar(disc - 10, 140),
    marker: [left, cy + 50],
  },
  {
    name: "Icon",
    detail: `${ringIcon} pt, filled: onAccent or accentText`,
    point: [cx + icon * 0.32, cy],
    marker: [right, cy],
  },
  {
    name: "Label",
    detail: `ringLabel type, ${ringLabelGap} pt below; part of the button`,
    point: [cx + 40, cy + outer + (ringLabelGap * S) / 2],
    marker: [right, cy + outer + (ringLabelGap * S) / 2],
  },
];

/** Ends a leader at the marker's edge instead of its center. */
function leaderEnd([x1, y1]: Point, [x2, y2]: Point): Point {
  const length = Math.hypot(x2 - x1, y2 - y1);
  return [x2 - ((x2 - x1) / length) * markerRadius, y2 - ((y2 - y1) / length) * markerRadius];
}

function Anatomy() {
  return (
    <div className="g-anatomy">
      <svg
        className="g-anatomy__figure"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-labelledby="ring-anatomy-title"
      >
        <title id="ring-anatomy-title">Ring button anatomy, three times real size</title>
        <circle
          className="g-anatomy__ring"
          cx={cx}
          cy={cy}
          r={outer - (ringStroke * S) / 2}
          strokeWidth={ringStroke * S}
        />
        <circle className="g-anatomy__disc" cx={cx} cy={cy} r={disc} />
        <g className="g-anatomy__icon" transform={`translate(${cx - icon / 2} ${cy - icon / 2})`}>
          <MaterialGlyph glyph={icons.lend.material} filled size={icon} />
        </g>
        <text
          className="g-anatomy__label"
          x={cx}
          y={labelTop + labelSize * 0.8}
          textAnchor="middle"
          fontSize={labelSize}
        >
          Lend my camera
        </text>
        {parts.map(({ name, point, marker }, i) => {
          const [x2, y2] = leaderEnd(point, marker);
          return (
            <g key={name}>
              <line className="g-anatomy__leader" x1={point[0]} y1={point[1]} x2={x2} y2={y2} />
              <circle className="g-anatomy__dot" cx={point[0]} cy={point[1]} r={4} />
              <circle
                className="g-anatomy__marker"
                cx={marker[0]}
                cy={marker[1]}
                r={markerRadius}
              />
              <text
                className="g-anatomy__number"
                x={marker[0]}
                y={marker[1]}
                textAnchor="middle"
                dominantBaseline="central"
              >
                {i + 1}
              </text>
            </g>
          );
        })}
      </svg>
      <ol className="g-anatomy__legend" aria-label="Ring anatomy">
        {parts.map(({ name, detail }) => (
          <li key={name}>
            <span>
              <strong>{name}</strong> {detail}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Demo({ name, caption, children }: { name: string; caption: string; children: ReactNode }) {
  return (
    <figure className="g-demo">
      <div className="g-demo__stage">{children}</div>
      <figcaption>
        <strong>{name}</strong> — {caption}
      </figcaption>
    </figure>
  );
}

export function Ring() {
  return (
    <section id="ring" className="g-section" data-testid="guideline-ring">
      <h2>The ring</h2>
      <p className="g-lede">
        The camera shutter turned into the signature control. Rings are for camera moments: lending,
        borrowing, capturing, a photo on its way. Decisions inside panels use capsule buttons.
      </p>
      <Anatomy />

      <h3 className="g-subhead">Family</h3>
      <div className="g-demos">
        <Demo name="Ring button, filled" caption="Lend. The accent disc.">
          <RingButton variant="filled" icon="lend" label="Lend my camera" />
        </Demo>
        <Demo name="Ring button, tinted" caption="Borrow. The tinted disc.">
          <RingButton variant="tinted" icon="borrow" label="Borrow a camera" />
        </Demo>
        <Demo name="Shutter" caption="Takes the photo; white over the preview.">
          <div className="ex-camera">
            <Shutter state="ready" onCapture={() => {}} />
          </div>
        </Demo>
        <Demo name="Progress ring" caption="Fills with real progress only.">
          <ProgressRing value={0.75} label="Photo arriving" />
        </Demo>
        <Demo name="Live dot" caption="Something is happening now.">
          <LiveDot />
        </Demo>
      </div>

      <h3 className="g-subhead">States</h3>
      <div className="g-demos">
        <Demo name="Rest" caption="Press it: the disc squeezes to 92% and springs back.">
          <RingButton variant="filled" icon="lend" label="Lend my camera" />
        </Demo>
        <Demo name="Waiting" caption="A quarter arc turns on the track; presses do nothing.">
          <RingButton variant="filled" icon="lend" label="Waiting for Sarah" state="waiting" />
        </Demo>
        <Demo name="Unavailable" caption="Neutral, and it says why.">
          <RingButton
            variant="tinted"
            icon="borrow"
            label="Borrow a camera"
            state="unavailable"
            unavailableReason="Needs the internet"
          />
        </Demo>
      </div>
      <ul className="g-rules">
        <li>Rings are for camera moments; panels use capsule buttons.</li>
        <li>A ring acts on release, once per press.</li>
        <li>Progress rings fill only with real progress.</li>
        <li>One live dot per screen.</li>
      </ul>
    </section>
  );
}
