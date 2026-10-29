import type { PanelId } from "@prototype/model/types";
import type { Screen } from "@prototype/screens";
import { Connect } from "./Connect";
import { Invitation } from "./Invitation";
import { Session } from "./Session";

/** Each panel's view. A panel without one shows its name until it is built. */
export const panels: Partial<Record<PanelId, Screen>> = {
  invitation: Invitation,
  connect: Connect,
  session: Session,
};

export const panelNames: Record<PanelId, string> = {
  invitation: "Invitation",
  connect: "Connect",
  session: "Session",
  recovery: "Recovery",
};
