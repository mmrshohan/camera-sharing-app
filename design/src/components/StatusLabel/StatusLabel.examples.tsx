import type { LabelKind } from "@tokens";
import type { Example } from "@workspace/types";
import { StatusLabel } from "./StatusLabel";

// Words from the photo lifecycle (design spec, Appendix C).
const samples: [LabelKind, string, string][] = [
  ["live", "Live", "A session is on"],
  ["sending", "Sending", "On its way"],
  ["saved", "Saved to Photos", "Safe in the phone's gallery"],
  ["waiting", "Waiting for Wi-Fi", "Paused, not lost"],
  ["neutral", "Only in this app", "Received, not in Photos yet"],
];

export const examples: Example[] = samples.map(([kind, words, meaning]) => ({
  id: kind,
  title: meaning,
  state: kind,
  layout: "compact",
  render: () => <StatusLabel kind={kind}>{words}</StatusLabel>,
}));
