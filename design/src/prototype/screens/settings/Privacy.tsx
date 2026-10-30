import { Text } from "@components/Text";
import { strings as s } from "@prototype/copy/settings";
import type { DeviceId } from "@prototype/model/types";
import { SettingsPage } from "./Page";

export const screenId = "screens/settings/Privacy";

export function Privacy({ id }: { id: DeviceId }) {
  return (
    <SettingsPage id={id} title={s.privacy}>
      <div className="stack">
        {s.privacyPoints.map((point) => (
          <Text key={point} style="body" as="p">
            {point}
          </Text>
        ))}
      </div>
    </SettingsPage>
  );
}
