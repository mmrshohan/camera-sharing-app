import type { PanelId } from "@prototype/model/types";
import type { Screen } from "@prototype/screens";

/** Each panel's view. A panel without one shows its name until it is built. */
export const panels: Partial<Record<PanelId, Screen>> = {};

export const panelNames: Record<PanelId, string> = {
  invitation: "Invitation",
  connect: "Connect",
  session: "Session",
  recovery: "Recovery",
};
