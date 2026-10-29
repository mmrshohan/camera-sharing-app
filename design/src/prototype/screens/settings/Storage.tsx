import { EmptyState } from "@components/EmptyState";
import { GroupedList } from "@components/GroupedList";
import { InlineMessage } from "@components/InlineMessage";
import { ListRow } from "@components/ListRow";
import { photos } from "@prototype/copy/plural";
import { strings as s } from "@prototype/copy/settings";
import { remainingInPhotos } from "@prototype/model/selectors";
import type { DeviceId } from "@prototype/model/types";
import { useDeviceView } from "@prototype/shell/deviceView";
import { SettingsPage } from "./Page";

export const screenId = "screens/settings/Storage";

export function Storage({ id }: { id: DeviceId }) {
  const { device } = useDeviceView(id);
  const saved = remainingInPhotos(device);
  const onlyHere = device.gallery.filter(
    (p) => p.stage !== "saved" && p.stage !== "arriving",
  ).length;
  return (
    <SettingsPage id={id} title={s.storage}>
      {device.storageFull && (
        <InlineMessage
          tone="problem"
          icon="storage"
          title={s.storageFull}
          body={s.storageFullBody}
        />
      )}
      {device.gallery.length === 0 ? (
        <EmptyState icon="storage" title={s.storageEmpty} />
      ) : (
        <GroupedList footer={s.storageNote}>
          <ListRow title={s.onlyHere} trailing={{ kind: "value", text: photos(onlyHere) }} />
          <ListRow title={s.alsoSaved} trailing={{ kind: "value", text: photos(saved) }} />
        </GroupedList>
      )}
    </SettingsPage>
  );
}
