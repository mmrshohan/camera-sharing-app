import type { PanelId } from "@prototype/model/types";
import type { Screen } from "@prototype/screens";
import { Connect } from "./Connect";
import { Invitation } from "./Invitation";
import { Recovery } from "./Recovery";
import { Session } from "./Session";

/** Each panel's view. */
export const panels: Record<PanelId, Screen> = {
  invitation: Invitation,
  connect: Connect,
  session: Session,
  recovery: Recovery,
};
