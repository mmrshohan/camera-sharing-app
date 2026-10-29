import { devices } from "@components/DeviceFrame/devices";
import type { DeviceId, DeviceModel, TextSize, Theme } from "@prototype/model/types";
import { getScenario } from "./catalog";

/** What the review shell's URL records, so any state can be shared as a link (design spec §10). */
export interface UrlState {
  scenario: string;
  view: "single" | "dual";
  focus: DeviceId;
  alexDevice: DeviceModel;
  sarahDevice: DeviceModel;
  /** Each phone's own theme and text size: `theme` and `text` in the URL set both. */
  alexTheme: Theme;
  sarahTheme: Theme;
  alexText: TextSize;
  sarahText: TextSize;
  /** An earlier release to compare with, such as "1.0.0". */
  compare: string | null;
}

export const defaultUrlState: UrlState = {
  scenario: "home-photos",
  view: "dual",
  focus: "sarah",
  alexDevice: "iphone16pro",
  sarahDevice: "galaxyA15",
  alexTheme: "light",
  sarahTheme: "light",
  alexText: "default",
  sarahText: "default",
  compare: null,
};

/** A look the URL writes once when both phones share it, and per phone when they differ. */
const looks = [
  { both: "theme", alex: "alexTheme", sarah: "sarahTheme" },
  { both: "text", alex: "alexText", sarah: "sarahText" },
] as const;
const semver = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/;

const isModel = (v: string): v is DeviceModel => Object.hasOwn(devices, v);

/** Reads the shell's state from a query string. Bad values fall back to defaults, each with a notice. */
export function parseUrlState(search: string): { state: UrlState; notices: string[] } {
  const params = new URLSearchParams(search);
  const notices: string[] = [];
  const state: UrlState = { ...defaultUrlState };
  const ignore = (key: string, value: string, using: string) =>
    notices.push(`Ignored ${key} “${value}”: showing ${using}.`);

  const scenario = params.get("scenario");
  if (scenario !== null) {
    if (getScenario(scenario)) state.scenario = scenario;
    else ignore("scenario", scenario, `“${getScenario(defaultUrlState.scenario)?.title ?? ""}”`);
  }
  const view = params.get("view");
  if (view !== null) {
    if (view === "single" || view === "dual") state.view = view;
    else ignore("view", view, "both phones");
  }
  const focus = params.get("focus");
  if (focus !== null) {
    if (focus === "alex" || focus === "sarah") state.focus = focus;
    else ignore("focus", focus, "Sarah's phone");
  }
  for (const key of ["alexDevice", "sarahDevice"] as const) {
    const value = params.get(key);
    if (value === null) continue;
    if (isModel(value)) state[key] = value;
    else ignore(key, value, `the ${devices[defaultUrlState[key]].name}`);
  }
  // Both phones first, then each phone's own value.
  for (const key of ["theme", "alexTheme", "sarahTheme"] as const) {
    const theme = params.get(key);
    if (theme === null) continue;
    if (theme !== "light" && theme !== "dark") ignore(key, theme, "light");
    else if (key === "theme") state.alexTheme = state.sarahTheme = theme;
    else state[key] = theme;
  }
  for (const key of ["text", "alexText", "sarahText"] as const) {
    const text = params.get(key);
    if (text === null) continue;
    if (text !== "default" && text !== "largest") ignore(key, text, "the default size");
    else if (key === "text") state.alexText = state.sarahText = text;
    else state[key] = text;
  }
  const compare = params.get("compare");
  if (compare !== null) {
    if (semver.test(compare)) state.compare = compare;
    else ignore("compare", compare, "no comparison");
  }
  return { state, notices };
}

/** Writes the shell's state as a query string, leaving out defaults. */
export function formatUrlState(state: UrlState): string {
  const params = new URLSearchParams();
  const set = (key: string, value: string | null, fallback: string | null) => {
    if (value !== null && value !== fallback) params.set(key, value);
  };
  for (const key of ["scenario", "view", "focus", "alexDevice", "sarahDevice"] as const) {
    set(key, state[key], defaultUrlState[key]);
  }
  for (const { both, alex, sarah } of looks) {
    if (state[alex] === state[sarah]) {
      set(both, state[alex], defaultUrlState[alex]);
    } else {
      set(alex, state[alex], defaultUrlState[alex]);
      set(sarah, state[sarah], defaultUrlState[sarah]);
    }
  }
  set("compare", state.compare, defaultUrlState.compare);
  const query = params.toString();
  return query ? `?${query}` : "";
}
