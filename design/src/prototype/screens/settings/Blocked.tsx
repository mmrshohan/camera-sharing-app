import { EmptyState } from "@components/EmptyState";
import { GroupedList } from "@components/GroupedList";
import { ListRow } from "@components/ListRow";
import { strings as s } from "@prototype/copy/settings";
import type { DeviceId } from "@prototype/model/types";
import { useDeviceView } from "@prototype/shell/deviceView";
import { SettingsPage } from "./Page";

export const screenId = "screens/settings/Blocked";

export function Blocked({ id }: { id: DeviceId }) {
  const { device } = useDeviceView(id);
  const { blocked } = device.account;
  return (
    <SettingsPage id={id} title={s.blocked}>
      {blocked.length === 0 ? (
        <EmptyState icon="blocked" title={s.blockedEmpty} />
      ) : (
        <GroupedList>
          {blocked.map((handle) => (
            <ListRow key={handle} title={handle} />
          ))}
        </GroupedList>
      )}
    </SettingsPage>
  );
}
