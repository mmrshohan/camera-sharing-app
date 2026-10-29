import { useRef } from "react";
import { Button } from "@components/Button";
import { ConfirmDialog } from "@components/ConfirmDialog";
import { GroupedList } from "@components/GroupedList";
import { ListRow } from "@components/ListRow";
import { Panel } from "@components/Panel";
import { Text } from "@components/Text";
import { cameraStatusText } from "@prototype/copy/plural";
import { strings as s } from "@prototype/copy/session";
import { cancelingNow, endingNow, hostItems, hostSummary } from "@prototype/model/selectors";
import type { DeviceId } from "@prototype/model/types";
import { minutesSeconds } from "@prototype/screens/parts";
import { useDeviceView } from "@prototype/shell/deviceView";
import "@prototype/screens/screens.css";

export const screenId = "panels/Session";

/** Alex's view of the session: counts, each photo by number and label, time left, and the way out. */
export function Session({ id }: { id: DeviceId }) {
  const { device, world, dispatch, screen } = useDeviceView(id);
  const summary = useRef<HTMLDivElement>(null);
  const session = world.session;
  if (!session) return null;

  const to = session.recipient.name;
  const counts = hostSummary(world);
  const items = hostItems(world);
  const unsent = counts.preparing + counts.sending + counts.waitingInternet + counts.waitingWifi;
  const ending = endingNow(world);
  const canceling = cancelingNow(world);
  const active = session.state === "active";
  const closeConfirm = () => dispatch({ type: "closeConfirm", device: id });

  return (
    <>
      <Panel
        open={device.ui.panel === "session"}
        title={s.title(to)}
        onClose={() => dispatch({ type: "closePanel", device: id })}
        container={screen}
        detent="large"
        // Focus starts on what is happening, not on End session.
        initialFocus={summary}
      >
        <div className="panel-stack">
          <div ref={summary} tabIndex={-1} className="stack stack--tight panel-focus">
            <Text style="headline" as="p">
              {cameraStatusText(counts)}
            </Text>
            {active && session.endsAt !== null && (
              <Text style="subheadline" as="p" tone="ink2">
                {s.endsIn(minutesSeconds(session.endsAt - world.clock))}
              </Text>
            )}
          </div>
          {/* Labels only: no images, nothing about Sarah's saving (R3, D7). */}
          <GroupedList header={s.photosHeader}>
            {items.length === 0 ? (
              <ListRow title={s.none} />
            ) : (
              items.map((item) => (
                <ListRow
                  key={item.index}
                  title={s.photo(item.index)}
                  trailing={{ kind: "value", text: item.label }}
                />
              ))
            )}
          </GroupedList>
          {active && (
            <div className="panel-actions">
              <Button
                variant="destructive"
                fullWidth
                onPress={() => dispatch({ type: "openConfirm", device: id, confirm: "endSession" })}
              >
                {s.endSession}
              </Button>
              {unsent > 0 && (
                <Button
                  variant="plain"
                  fullWidth
                  onPress={() =>
                    dispatch({ type: "openConfirm", device: id, confirm: "cancelUnsent" })
                  }
                >
                  {s.cancelUnsent}
                </Button>
              )}
            </div>
          )}
        </div>
      </Panel>
      <ConfirmDialog
        open={device.ui.confirm === "endSession"}
        destructive
        title={s.endTitle}
        message={s.endMessage(ending.keepGoing, ending.needApproval, to)}
        confirmLabel={s.endSession}
        cancelLabel={s.keepShooting}
        onConfirm={() => dispatch({ type: "endSession" })}
        onCancel={closeConfirm}
        container={screen}
      />
      <ConfirmDialog
        open={device.ui.confirm === "cancelUnsent"}
        destructive
        title={s.cancelTitle}
        message={s.cancelMessage(canceling.unsent, to, canceling.onTheirWay)}
        confirmLabel={s.cancelConfirm}
        cancelLabel={s.keepSending}
        onConfirm={() => dispatch({ type: "cancelUnsent" })}
        onCancel={closeConfirm}
        container={screen}
      />
    </>
  );
}
