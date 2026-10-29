import { GroupedList } from "@components/GroupedList";
import { InlineMessage } from "@components/InlineMessage";
import { ListRow } from "@components/ListRow";
import { strings as s } from "@prototype/copy/settings";
import type { DeviceId } from "@prototype/model/types";
import { useDeviceView } from "@prototype/shell/deviceView";
import { SettingsPage } from "./Page";

export const screenId = "screens/settings/Help";

export function Help({ id }: { id: DeviceId }) {
  const { device } = useDeviceView(id);
  return (
    <SettingsPage id={id} title={s.help}>
      {device.ui.notice === "supportUnavailable" && (
        <InlineMessage tone="waiting" title={s.supportUnavailable} />
      )}
      <GroupedList>
        {s.helpTopics.map((topic) => (
          <ListRow key={topic} title={topic} />
        ))}
      </GroupedList>
      <GroupedList>
        <ListRow icon="help" title={s.contact} />
      </GroupedList>
    </SettingsPage>
  );
}
