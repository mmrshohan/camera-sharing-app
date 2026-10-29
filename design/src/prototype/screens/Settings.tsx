import { ConfirmDialog } from "@components/ConfirmDialog";
import { devices } from "@components/DeviceFrame";
import { GroupedList } from "@components/GroupedList";
import { IconButton } from "@components/IconButton";
import { ListRow } from "@components/ListRow";
import { TopBar } from "@components/TopBar";
import { strings as a } from "@prototype/copy/account";
import { strings as s } from "@prototype/copy/settings";
import type { DeviceId, Route } from "@prototype/model/types";
import { useDeviceView } from "@prototype/shell/deviceView";
import { ScreenBody } from "./parts";

export const screenId = "screens/Settings";

export function Settings({ id }: { id: DeviceId }) {
  const { device, dispatch, screen } = useDeviceView(id);
  const { settings, permissions } = device;
  const ios = devices[device.model].platform === "ios";
  // Android saves to MediaStore without a permission, so only an iPhone can have Photos access off.
  const photosOff = ios && permissions.photosAddOnly === "denied";
  const notificationsOff = permissions.notifications === "denied";
  const onlyHere = device.gallery.filter(
    (p) => p.stage !== "saved" && p.stage !== "arriving",
  ).length;
  const go = (route: Route) => () => dispatch({ type: "navigate", device: id, route });

  return (
    <>
      <ScreenBody
        grouped
        top={(scrolled) => (
          <TopBar
            title={s.title}
            collapsed={scrolled}
            leading={<IconButton icon="back" label={s.back} onPress={go("home")} />}
          />
        )}
      >
        <GroupedList header={s.account}>
          <ListRow
            icon="account"
            title={s.signIn}
            trailing={{ kind: "chevron" }}
            onPress={go("settings/signin")}
          />
          <ListRow
            icon="devices"
            title={s.devices}
            trailing={{ kind: "chevron" }}
            onPress={go("settings/devices")}
          />
          <ListRow
            icon="blocked"
            title={s.blocked}
            trailing={{ kind: "chevron" }}
            onPress={go("settings/blocked")}
          />
        </GroupedList>
        <GroupedList header={s.photosSection}>
          <ListRow
            title={s.autoSave}
            subtitle={
              photosOff ? s.autoSaveUnavailable : settings.autoSave ? s.autoSaveOn : s.autoSaveOff
            }
            trailing={{
              kind: "toggle",
              checked: settings.autoSave && !photosOff,
              onChange: (value) => {
                dispatch({ type: "setSetting", device: id, key: "autoSave", value });
                // The moment of need for Photos access (R8); asked only once.
                if (value)
                  dispatch({ type: "requestPermission", device: id, kind: "photosAddOnly" });
              },
            }}
          />
          <ListRow
            title={s.wifiOnly}
            subtitle={s.wifiOnlyNote}
            trailing={{
              kind: "toggle",
              checked: settings.wifiOnly,
              onChange: (value) =>
                dispatch({ type: "setSetting", device: id, key: "wifiOnly", value }),
            }}
          />
          <ListRow
            title={s.notifications}
            subtitle={notificationsOff ? s.notificationsOff : s.notificationsNote}
            trailing={{
              kind: "toggle",
              checked: settings.notifications && !notificationsOff,
              onChange: (value) => {
                dispatch({ type: "setSetting", device: id, key: "notifications", value });
                if (value)
                  dispatch({ type: "requestPermission", device: id, kind: "notifications" });
              },
            }}
          />
        </GroupedList>
        <GroupedList header={s.more}>
          <ListRow
            icon="storage"
            title={s.storage}
            trailing={{ kind: "chevron" }}
            onPress={go("settings/storage")}
          />
          <ListRow
            icon="privacy"
            title={s.privacy}
            trailing={{ kind: "chevron" }}
            onPress={go("settings/privacy")}
          />
          <ListRow
            icon="help"
            title={s.help}
            trailing={{ kind: "chevron" }}
            onPress={go("settings/help")}
          />
          <ListRow
            icon="report"
            title={s.report}
            trailing={{ kind: "chevron" }}
            onPress={go("settings/report")}
          />
        </GroupedList>
        <GroupedList>
          <ListRow
            icon="signOut"
            title={s.signOut}
            destructive
            onPress={() => dispatch({ type: "openConfirm", device: id, confirm: "signOut" })}
          />
          <ListRow
            icon="delete"
            title={s.deleteAccount}
            destructive
            onPress={go("settings/delete")}
          />
        </GroupedList>
      </ScreenBody>
      <ConfirmDialog
        open={device.ui.confirm === "signOut"}
        destructive
        title={a.signOutTitle}
        message={a.signOutMessage(onlyHere)}
        confirmLabel={a.signOut}
        cancelLabel={a.cancel}
        onConfirm={() => dispatch({ type: "signOut", device: id })}
        onCancel={() => dispatch({ type: "closeConfirm", device: id })}
        container={screen}
      />
    </>
  );
}
