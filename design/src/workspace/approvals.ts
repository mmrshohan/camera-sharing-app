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
export const groupApprovals: GroupApproval[] = [];
