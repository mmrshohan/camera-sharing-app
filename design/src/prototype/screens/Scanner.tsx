import { useState } from "react";
import { Button } from "@components/Button";
import { IconButton } from "@components/IconButton";
import { TextField } from "@components/TextField";
import { Viewfinder, type ViewfinderState } from "@components/Viewfinder";
import { strings as s } from "@prototype/copy/scanner";
import type { DeviceId, Notice } from "@prototype/model/types";
import { useDeviceView } from "@prototype/shell/deviceView";

export const screenId = "screens/Scanner";

const usernameMessages: Partial<Record<Notice, string>> = {
  noMatch: s.noMatch,
  tooManyRequests: s.tooManyRequests,
  notAvailable: s.notAvailable,
};

/** Alex scans Sarah's invitation, or types her exact username instead. */
export function Scanner({ id }: { id: DeviceId }) {
  const { device, dispatch } = useDeviceView(id);
  const [typing, setTyping] = useState(false);
  const { notice, field } = device.ui;
  const message = notice ? usernameMessages[notice] : undefined;
  const entering = typing || message !== undefined || field.value !== "";
  const denied = device.permissions.camera === "denied";
  const state: ViewfinderState = denied
    ? "denied"
    : notice === "cameraInUse"
      ? "unavailable"
      : notice === "notAnInvitation"
        ? "invalid"
        : "scanning";

  const send = () => {
    if (field.value.trim()) dispatch({ type: "requestByUsername", username: field.value.trim() });
  };
  const scanInstead = () => {
    setTyping(false);
    dispatch({ type: "typeField", device: id, value: "" });
  };

  return (
    <div className="scanner">
      <Viewfinder state={state} />
      <div className="scanner__top">
        <IconButton
          icon="close"
          label={s.close}
          tone="onCamera"
          onPress={() => {
            dispatch({ type: "typeField", device: id, value: "" });
            dispatch({ type: "navigate", device: id, route: "home" });
          }}
        />
      </div>
      <div className="scanner__bottom">
        {entering ? (
          <div className="scanner__username">
            <TextField
              label={s.usernameLabel}
              prefix="@"
              value={field.value}
              state={message ? "invalid" : "idle"}
              {...(message !== undefined && { message })}
              onChange={(value) => dispatch({ type: "typeField", device: id, value })}
              onSubmit={send}
            />
            <Button variant="filled" fullWidth disabled={field.value.trim() === ""} onPress={send}>
              {s.send}
            </Button>
            <Button variant="plain" onPress={scanInstead}>
              {s.scanInstead}
            </Button>
          </div>
        ) : (
          <>
            {denied && (
              // Settings is outside the app; here it stands in for turning access back on there.
              <Button
                variant="filled"
                onPress={() =>
                  dispatch({ type: "permission", device: id, kind: "camera", allow: true })
                }
              >
                {s.openSettings}
              </Button>
            )}
            <Button variant="tinted" onPress={() => setTyping(true)}>
              {s.typeUsername}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
