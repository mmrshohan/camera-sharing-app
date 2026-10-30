import { Button } from "@components/Button";
import { ConfirmDialog } from "@components/ConfirmDialog";
import { Text } from "@components/Text";
import { strings as a } from "@prototype/copy/account";
import { strings as s } from "@prototype/copy/settings";
import { remainingInPhotos } from "@prototype/model/selectors";
import type { DeviceId } from "@prototype/model/types";
import { useDeviceView } from "@prototype/shell/deviceView";
import { SettingsPage } from "./Page";

export const screenId = "screens/settings/DeleteAccount";

export function DeleteAccount({ id }: { id: DeviceId }) {
  const { device, dispatch, screen } = useDeviceView(id);
  return (
    <>
      <SettingsPage
        id={id}
        title={s.deleteAccount}
        bar={
          <Button
            variant="destructive"
            fullWidth
            onPress={() => dispatch({ type: "openConfirm", device: id, confirm: "deleteAccount" })}
          >
            {a.deleteButton}
          </Button>
        }
      >
        <Text style="body" as="p">
          {a.deleteMessage}
        </Text>
      </SettingsPage>
      {/* The second step: copies saved to Photos are counted, because they stay (R11). */}
      <ConfirmDialog
        open={device.ui.confirm === "deleteAccount"}
        destructive
        title={a.deleteTitle}
        message={a.deleteConfirmMessage(remainingInPhotos(device))}
        confirmLabel={a.deleteConfirm}
        cancelLabel={a.cancel}
        onConfirm={() => dispatch({ type: "deleteAccount", device: id })}
        onCancel={() => dispatch({ type: "closeConfirm", device: id })}
        container={screen}
      />
    </>
  );
}
