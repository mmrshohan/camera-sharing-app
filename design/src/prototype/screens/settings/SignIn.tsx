import { GroupedList } from "@components/GroupedList";
import { ListRow } from "@components/ListRow";
import { strings as s } from "@prototype/copy/settings";
import type { DeviceId } from "@prototype/model/types";
import { useDeviceView } from "@prototype/shell/deviceView";
import { SettingsPage } from "./Page";

export const screenId = "screens/settings/SignIn";

export function SignIn({ id }: { id: DeviceId }) {
  const { device } = useDeviceView(id);
  const { methods } = device.account;
  return (
    <SettingsPage id={id} title={s.signIn}>
      <GroupedList {...(methods.length === 1 && { footer: s.lastMethod })}>
        {methods.map((method) => (
          <ListRow
            key={method}
            title={s.methods[method]}
            trailing={{ kind: "value", text: s.connected }}
          />
        ))}
      </GroupedList>
    </SettingsPage>
  );
}
