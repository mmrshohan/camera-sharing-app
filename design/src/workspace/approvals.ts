import type { ComponentGroup } from "./types";

export interface GroupApproval {
  group: ComponentGroup;
  /** ISO date of the owner's approval. */
  date: string;
  /** The owner's words, quoted from the review. */
  note: string;
}

/**
 * Owner approvals of Library groups. A component can only be "final" when its group is listed here
 * (enforced by tests/unit/registry.test.ts). Append one entry per approval; never edit past entries.
 */
export const groupApprovals: GroupApproval[] = [
  { group: 1, date: "2026-10-29", note: "Group 1 approved." },
  { group: 2, date: "2026-10-29", note: "Group 2 approved." },
  { group: 3, date: "2026-10-29", note: "Group 3 approved." },
  { group: 4, date: "2026-10-29", note: "Group 4 approved." },
];
