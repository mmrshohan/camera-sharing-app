import type { ReactNode } from "react";
import { IconButton } from "@components/IconButton";
import { TopBar } from "@components/TopBar";
import { strings as s } from "@prototype/copy/settings";
import type { DeviceId } from "@prototype/model/types";
import { useDeviceView } from "@prototype/shell/deviceView";
import { ScreenBody } from "../parts";

/** A settings page: its title, a way back to Settings, and its content. */
export function SettingsPage({
  id,
  title,
  children,
  bar,
}: {
  id: DeviceId;
  title: string;
  children: ReactNode;
  bar?: ReactNode;
}) {
  const { dispatch } = useDeviceView(id);
  return (
    <ScreenBody
      top={(scrolled) => (
        <TopBar
          title={title}
          collapsed={scrolled}
          leading={
            <IconButton
              icon="back"
              label={s.back}
              onPress={() => dispatch({ type: "navigate", device: id, route: "settings" })}
            />
          }
        />
      )}
      {...(bar !== undefined && { bar })}
    >
      {children}
    </ScreenBody>
  );
}
