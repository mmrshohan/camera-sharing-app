import type { ReactNode } from "react";
import type { Platform } from "@tokens";
import type { Surface } from "@shared/surface";

export type ComponentGroup = 1 | 2 | 3 | 4;
export type ComponentStatus = "draft" | "review" | "final";
export type NativeStatus = "not-started" | "in-progress" | "done";

export interface ChangelogEntry {
  version: string;
  date: string;
  summary: string;
}

/** Everything the Library and Lab pages show about a component. One file per component. */
export interface ComponentMeta {
  /** kebab-case, used in URLs: /library/<id>. */
  id: string;
  name: string;
  group: ComponentGroup;
  /** Brand components look the same on both platforms; system components follow each platform. */
  layer: "brand" | "system";
  status: ComponentStatus;
  version: string;
  summary: string;
  anatomy: string[];
  /** Token names, e.g. "color.accent" or "shape.ringSize". */
  tokens: string[];
  states: string[];
  accessibility: string[];
  /** Exact motion values, or an empty list when the component does not move. */
  motion: string[];
  native: { ios: string; android: string; status: Record<Platform, NativeStatus> };
  changelog: ChangelogEntry[];
}

/** The surface a preview renders on. Same shape components read through useSurface(). */
export type PreviewContext = Surface;

export interface Example {
  id: string;
  title: string;
  /** Must match one of the component's meta.states. */
  state: string;
  render: (ctx: PreviewContext) => ReactNode;
}

export interface ComponentEntry {
  meta: ComponentMeta;
  examples: Example[];
}

export const groupNames: Record<ComponentGroup, string> = {
  1: "Foundations and rings",
  2: "Actions and status",
  3: "Structure, people and pairing, camera",
  4: "Photos and system surfaces",
};

export const statusNames: Record<ComponentStatus, string> = {
  draft: "Draft",
  review: "In review",
  final: "Final",
};
