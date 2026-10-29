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
  theme: Theme;
  text: TextSize;
  /** An earlier release to compare with, such as "1.0.0". */
  compare: string | null;
}

export const defaultUrlState: UrlState = {
  scenario: "home-photos",
  view: "dual",
  focus: "sarah",
  alexDevice: "iphone16pro",
  sarahDevice: "galaxyA15",
  theme: "light",
  text: "default",
  compare: null,
};

const order = [
  "scenario",
  "view",
  "focus",
  "alexDevice",
  "sarahDevice",
  "theme",
  "text",
  "compare",
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
  const theme = params.get("theme");
  if (theme !== null) {
    if (theme === "light" || theme === "dark") state.theme = theme;
    else ignore("theme", theme, "light");
  }
  const text = params.get("text");
  if (text !== null) {
    if (text === "default" || text === "largest") state.text = text;
    else ignore("text", text, "the default size");
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
  for (const key of order) {
    const value = state[key];
    if (value !== null && value !== defaultUrlState[key]) params.set(key, value);
  }
  const query = params.toString();
  return query ? `?${query}` : "";
}
