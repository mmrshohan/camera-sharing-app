import { useState } from "react";
import { Button } from "@components/Button";
import { DestinationPill } from "@components/DestinationPill";
import { LastShotWell } from "@components/LastShotWell";
import { LiveDot } from "@components/LiveDot";
import { Panel } from "@components/Panel";
import { Shutter } from "@components/Shutter";
import { Text } from "@components/Text";
import { springToMotion, tokens, type SpringName } from "@tokens";
import { ExampleScreen } from "../ExampleScreen";
import { nthSample } from "../samples";

const springUse: Record<SpringName, string> = {
  navigate: "Screen pushes",
  panel: "Panels rising and following a drag",
  press: "Ring and button release",
  drop: "Captured photo dropping into the last-shot well",
};

const springs = Object.keys(tokens.motion.spring) as SpringName[];

/** Each capture drops a photo into the well while the destination pill pulses. */
function SendDemo() {
  const [photos, setPhotos] = useState(0);
  return (
    <div className="ex-camera g-send-demo">
      <DestinationPill name="Sarah" pulseKey={photos} onPress={() => {}} />
      <div className="g-send-demo__bar">
        <LastShotWell image={nthSample(photos)} dropKey={photos} onOpen={() => {}} />
        <Shutter state="ready" onCapture={() => setPhotos((n) => n + 1)} />
        <span className="g-send-demo__spacer" />
      </div>
    </div>
  );
}

/** A live Panel: it rises on spring.panel and closes by drag, Escape or a tap outside. */
function PanelDemo() {
  const [open, setOpen] = useState(false);
  return (
    <ExampleScreen className="g-panel-screen">
      {(screen) => (
        <>
          <div className="ex-screen__center">
            <Button variant="tinted" onPress={() => setOpen(true)}>
              Open a panel
            </Button>
          </div>
          <Panel open={open} onClose={() => setOpen(false)} title="Panel" container={screen}>
            <Text style="body" as="p" tone="ink2">
              Drag the grabber down, press Escape or tap outside to close it.
            </Text>
          </Panel>
        </>
      )}
    </ExampleScreen>
  );
}

export function Motion() {
  const m = tokens.motion;
  return (
    <section id="motion" className="g-section" data-testid="guideline-motion">
      <h2>Motion</h2>
      <p className="g-lede">
        Motion proves what happened and never delays a photo. Springs everywhere, interruptible.
        With Reduce Motion on, all of it becomes a {m.fadeMs} ms fade.
      </p>
      <div className="g-demos">
        <figure className="g-demo">
          <div className="g-demo__stage">
            <span className="g-demo-develop" aria-hidden="true" />
          </div>
          <figcaption>
            <strong>Develop</strong> — a photo arrives: blur {m.develop.blur} → 0, saturation{" "}
            {m.develop.saturation} → 1, {m.develop.ms} ms
          </figcaption>
        </figure>
        <figure className="g-demo">
          <div className="g-demo__stage">
            <LiveDot />
          </div>
          <figcaption>
            <strong>Live dot</strong> — breathes {m.live.min} ↔ 1 every {m.live.periodMs} ms
          </figcaption>
        </figure>
        <figure className="g-demo">
          <div className="g-demo__stage">
            <span className="g-demo-press" aria-hidden="true">
              Press
            </span>
          </div>
          <figcaption>
            <strong>Press</strong> — buttons squeeze to {m.pressScale.button}, rings to{" "}
            {m.pressScale.ring}, in {m.pressDownMs} ms
          </figcaption>
        </figure>
      </div>
      <figure className="g-demo g-demo--panel">
        <div className="g-demo__stage g-demo__stage--tall">
          <SendDemo />
        </div>
        <figcaption>
          <strong>Send</strong> — press the shutter: the photo drops into the well on spring.drop (
          {m.spring.drop.response} s, {m.spring.drop.dampingFraction}) while “Sending to Sarah”
          pulses to {m.pulse.scale} over {m.pulse.ms} ms
        </figcaption>
      </figure>
      <figure className="g-demo g-demo--panel">
        <div className="g-demo__stage g-demo__stage--tall">
          <PanelDemo />
        </div>
        <figcaption>
          <strong>Panel</strong> — rises on spring.panel ({m.spring.panel.response} s,{" "}
          {m.spring.panel.dampingFraction}) as the screen dims; a drag past {m.dismiss.distance} pt
          or a fling faster than {m.dismiss.velocity} pt per ms closes it
        </figcaption>
      </figure>
      <div className="g-table-wrap">
        <table className="g-table">
          <thead>
            <tr>
              <th scope="col">Spring</th>
              <th scope="col">Response · damping fraction</th>
              <th scope="col">Stiffness · damping (mass 1)</th>
              <th scope="col">Used by</th>
            </tr>
          </thead>
          <tbody>
            {springs.map((name) => {
              const s = m.spring[name];
              const converted = springToMotion(s);
              return (
                <tr key={name}>
                  <th scope="row">
                    <code>spring.{name}</code>
                  </th>
                  <td>
                    {s.response} s · {s.dampingFraction}
                  </td>
                  <td>
                    {converted.stiffness.toFixed(1)} · {converted.damping.toFixed(1)}
                  </td>
                  <td>{springUse[name]}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="g-muted">
        SwiftUI uses <code>.spring(response:dampingFraction:)</code>; Compose uses{" "}
        <code>spring(dampingRatio, stiffness)</code> with the values above.
      </p>
    </section>
  );
}
