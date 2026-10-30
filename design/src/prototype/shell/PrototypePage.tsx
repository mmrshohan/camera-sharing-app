import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { DeviceId, World } from "@prototype/model/types";
import { reduce } from "@prototype/model/world";
import { createWorld } from "@prototype/scenarios/build";
import { getScenario } from "@prototype/scenarios/catalog";
import { CompareView } from "@workspace/CompareView";
import { listReleases } from "@workspace/releases";
import { Segmented } from "@workspace/Segmented";
import {
  defaultUrlState,
  formatUrlState,
  parseUrlState,
  type UrlState,
} from "@prototype/scenarios/url";
import { ClockControls } from "./ClockControls";
import { DeviceControls } from "./DeviceControls";
import { Navigator } from "./Navigator";
import { PhoneEmbed } from "./PhoneEmbed";
import { simulationsFor } from "./simulations";
import { Stage } from "./Stage";
import { useWorld } from "./useWorld";
import "./shell.css";

const names: Record<DeviceId, string> = { alex: "Alex", sarah: "Sarah" };
const phones: readonly DeviceId[] = ["alex", "sarah"];

type Look = Pick<
  UrlState,
  "alexDevice" | "sarahDevice" | "alexTheme" | "sarahTheme" | "alexText" | "sarahText"
>;

/** A scenario's world on the phones, themes and text sizes being reviewed. */
function build(scenario: string, look: Look): World {
  const world = getScenario(scenario)?.build() ?? createWorld();
  const looks = [
    { device: "alex", model: look.alexDevice, theme: look.alexTheme, textSize: look.alexText },
    { device: "sarah", model: look.sarahDevice, theme: look.sarahTheme, textSize: look.sarahText },
  ] as const;
  return looks.reduce(
    (w, appearance) => reduce(w, { type: "setAppearance", ...appearance }),
    world,
  );
}

/** Each phone's own model, theme and text size, kept across Reset and scenarios. */
const lookOf = (world: World): Look => ({
  alexDevice: world.devices.alex.model,
  sarahDevice: world.devices.sarah.model,
  alexTheme: world.devices.alex.theme,
  sarahTheme: world.devices.sarah.theme,
  alexText: world.devices.alex.textSize,
  sarahText: world.devices.sarah.textSize,
});

/** The review shell: both phones, every scenario, a shared clock (design spec §10). */
export function PrototypePage() {
  const [boot] = useState(() => {
    const { state, notices } = parseUrlState(window.location.search);
    const params = new URLSearchParams(window.location.search);
    // Inside the compare view the shell shows only the phones.
    return {
      state,
      notices,
      paused: params.get("play") === "0",
      embedded: params.get("embed") === "1",
    };
  });
  const [scenario, setScenario] = useState(boot.state.scenario);
  const [view, setView] = useState(boot.state.view);
  const [focus, setFocus] = useState(boot.state.focus);
  const [notices, setNotices] = useState(boot.notices);
  const [present, setPresent] = useState(false);
  const [compare, setCompare] = useState(boot.state.compare);
  const [releases, setReleases] = useState<string[] | null>(null);
  const bare = present || boot.embedded;
  const presentButton = useRef<HTMLButtonElement>(null);
  const exitButton = useRef<HTMLButtonElement>(null);
  const presented = useRef(false);
  const [initial, setInitial] = useState(() => build(boot.state.scenario, boot.state));
  const { world, applied, dispatch, dispatchFrom, playing, setPlaying } = useWorld(initial, {
    playing: !boot.paused,
  });

  const choose = (id: string) => {
    setScenario(id);
    setInitial(build(id, lookOf(world)));
  };
  const reset = () => setInitial(build(scenario, lookOf(world)));

  // The URL always records what is shown, so any state can be shared as a link.
  const url: UrlState = {
    ...defaultUrlState,
    ...lookOf(world),
    scenario,
    view,
    focus,
    compare,
  };
  const play = boot.paused ? "play=0" : "";
  const withPlay = (search: string) => (play ? `${search}${search ? "&" : "?"}${play}` : search);
  const search = withPlay(formatUrlState(url));
  useEffect(() => {
    if (search !== window.location.search) {
      window.history.replaceState(window.history.state, "", `${window.location.pathname}${search}`);
    }
  }, [search]);

  // Earlier releases to compare with, once one has been built with npm run release:fetch.
  useEffect(() => {
    let live = true;
    void listReleases().then((list) => {
      if (live) setReleases(list);
    });
    return () => {
      live = false;
    };
  }, []);
  useEffect(() => {
    if (compare === null || releases === null || releases.includes(compare)) return;
    setNotices((current) => [
      ...current,
      `No release ${compare} is built here. Build it with npm run release:fetch ${compare}.`,
    ]);
    setCompare(null);
  }, [compare, releases]);
  const comparing = compare !== null && releases?.includes(compare) === true;

  // For the end-to-end tests: the world, as both phones see it.
  useEffect(() => {
    (window as Window & { __protoWorld?: World }).__protoWorld = world;
  }, [world]);

  useEffect(() => {
    document.documentElement.classList.toggle("proto-presenting", present);
    if (!present) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPresent(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [present]);
  // Focus follows the mode: to Exit on entering, and back to Present on leaving.
  useEffect(() => {
    if (present) exitButton.current?.focus();
    else if (presented.current) presentButton.current?.focus();
    presented.current = present;
  }, [present]);
  // The shell fills the window below the workspace header; only its own panes scroll.
  useLayoutEffect(() => {
    const html = document.documentElement;
    html.classList.add("proto-route");
    return () => html.classList.remove("proto-route", "proto-presenting");
  }, []);

  const onEvents = useRef<
    Partial<Record<DeviceId, (seq: number, event: Parameters<typeof dispatchFrom>[2]) => void>>
  >({});
  const onEventFor = useCallback(
    (id: DeviceId) =>
      (onEvents.current[id] ??= (seq: number, event: Parameters<typeof dispatchFrom>[2]) =>
        dispatchFrom(id, seq, event)),
    [dispatchFrom],
  );

  const shown = view === "dual" ? phones : [focus];
  const hrefFor = (id: string) => `/prototype${withPlay(formatUrlState({ ...url, scenario: id }))}`;

  return (
    <div className={bare ? "proto proto--present" : "proto"}>
      <h1 className="ws-visually-hidden">Prototype</h1>
      {!bare && <Navigator current={scenario} hrefFor={hrefFor} onChoose={choose} />}
      <div className="proto-main">
        {!bare && (
          <div className="proto-toolbar">
            {/* The options say what these are, so their names are for screen readers only. */}
            <Segmented
              legend="View"
              hideLegend
              name="view"
              options={[
                ["dual", "Both phones"],
                ["single", "One phone"],
              ]}
              value={view}
              onChange={setView}
            />
            {view === "single" && (
              <Segmented
                legend="Phone"
                hideLegend
                name="focus"
                options={[
                  ["alex", "Alex"],
                  ["sarah", "Sarah"],
                ]}
                value={focus}
                onChange={setFocus}
              />
            )}
            <ClockControls
              clock={world.clock}
              playing={playing}
              setPlaying={setPlaying}
              dispatch={dispatch}
            />
            {releases !== null && releases.length > 0 && (
              <label className="proto-field">
                <span>Compare with</span>
                <select value={compare ?? ""} onChange={(e) => setCompare(e.target.value || null)}>
                  <option value="">Nothing</option>
                  {releases.map((version) => (
                    <option key={version} value={version}>
                      v{version}
                    </option>
                  ))}
                </select>
              </label>
            )}
            <div className="proto-toolbar__end">
              <button type="button" className="proto-button proto-button--quiet" onClick={reset}>
                Reset
              </button>
              <button
                ref={presentButton}
                type="button"
                className="proto-button"
                onClick={() => setPresent(true)}
              >
                Present
              </button>
            </div>
          </div>
        )}
        {!bare && notices.length > 0 && (
          <p role="status" className="proto-notice">
            <span>{notices.join(" ")}</span>
            <button
              type="button"
              className="proto-button proto-button--quiet"
              onClick={() => setNotices([])}
            >
              Dismiss
            </button>
          </p>
        )}
        {comparing && compare !== null ? (
          <CompareView
            previous={compare}
            path={`/prototype${withPlay(formatUrlState({ ...url, compare: null }))}`}
          />
        ) : (
          <Stage count={shown.length === 1 ? 1 : 2}>
            {shown.map((id) => (
              <PhoneEmbed
                key={id}
                id={id}
                name={names[id]}
                world={world}
                applied={applied[id]}
                onEvent={onEventFor(id)}
                header={
                  bare ? null : (
                    <DeviceControls
                      id={id}
                      name={names[id]}
                      device={world.devices[id]}
                      dispatch={dispatch}
                      simulations={simulationsFor(world, id)}
                    />
                  )
                }
              />
            ))}
          </Stage>
        )}
        {present && (
          <button
            ref={exitButton}
            type="button"
            className="proto-button proto-exit"
            onClick={() => setPresent(false)}
          >
            Exit
          </button>
        )}
      </div>
    </div>
  );
}
