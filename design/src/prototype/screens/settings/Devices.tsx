import { GroupedList } from "@components/GroupedList";
import { ListRow } from "@components/ListRow";
import { strings as s } from "@prototype/copy/settings";
import type { DeviceId } from "@prototype/model/types";
import { useDeviceView } from "@prototype/shell/deviceView";
import { SettingsPage } from "./Page";

export const screenId = "screens/settings/Devices";

export function Devices({ id }: { id: DeviceId }) {
  const { device } = useDeviceView(id);
  return (
    <SettingsPage id={id} title={s.devices}>
      <GroupedList footer={s.devicesNote}>
        {device.account.devices.map((name, index) => (
          <ListRow
            key={name}
            icon="devices"
            title={name}
            {...(index === 0 && { subtitle: s.thisPhone })}
          />
        ))}
      </GroupedList>
    </SettingsPage>
  );
}
