import type { DeviceId, World } from "@prototype/model/types";

export type Journey = "start" | "connect" | "capture" | "photos" | "account" | "system";

/** The review shell's navigator lists scenarios by journey, in this order. */
export const journeys: readonly Journey[] = [
  "start",
  "connect",
  "capture",
  "photos",
  "account",
  "system",
];

export const journeyNames: Record<Journey, string> = {
  start: "Getting started",
  connect: "Connecting",
  capture: "Taking photos",
  photos: "Sarah's photos",
  account: "Settings and account",
  system: "System surfaces",
};

/** One state of the app, built from nothing every time (D13). */
export interface Scenario {
  /** `<where>-<state>`, such as `camera-wifi-only-waiting`. */
  id: string;
  journey: Journey;
  title: string;
  /** The phone the state is about. */
  focus: DeviceId | "both";
  /** A screen's main state, drawn on every phone and theme in the test matrix. */
  main?: boolean;
  build: () => World;
}
