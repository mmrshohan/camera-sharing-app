import { useEffect } from "react";
import { Button } from "@components/Button";
import { InlineMessage } from "@components/InlineMessage";
import { Text } from "@components/Text";
import { TextField } from "@components/TextField";
import { TopBar } from "@components/TopBar";
import { strings as s } from "@prototype/copy/username";
import { usernameProblem } from "@prototype/model/session";
import type { DeviceId } from "@prototype/model/types";
import { useDeviceView } from "@prototype/shell/deviceView";
import { ScreenBody } from "./parts";

export const screenId = "screens/Username";

/** How long typing pauses before the name is checked. */
const pauseMs = 500;

export function Username({ id }: { id: DeviceId }) {
  const { device, dispatch } = useDeviceView(id);
  const { field } = device.ui;
  const offline = device.network === "offline";

  // The name is checked once typing pauses.
  useEffect(() => {
    if (offline || field.state !== "idle" || field.value === "") return;
    const timer = window.setTimeout(
      () => dispatch({ type: "submitUsername", device: id }),
      pauseMs,
    );
    return () => window.clearTimeout(timer);
  }, [dispatch, id, offline, field.state, field.value]);

  const message =
    offline || field.value === ""
      ? undefined
      : field.state === "checking"
        ? s.checking
        : field.state === "valid"
          ? s.available(field.value)
          : field.state === "invalid"
            ? usernameProblem(field.value) === "notAllowed"
              ? s.notAllowed
              : s.taken
            : undefined;

  return (
    <ScreenBody
      top={(scrolled) => <TopBar title={s.title} collapsed={scrolled} />}
      bar={
        <Button
          variant="filled"
          fullWidth
          disabled={offline || field.state !== "valid"}
          onPress={() => dispatch({ type: "submitUsername", device: id })}
        >
          {s.continue}
        </Button>
      }
    >
      <Text style="body" as="p" tone="ink2">
        {s.body}
      </Text>
      <TextField
        label={s.label}
        prefix="@"
        value={field.value}
        state={offline ? "idle" : field.state}
        {...(message !== undefined && { message })}
        onChange={(value) => dispatch({ type: "typeField", device: id, value })}
      />
      {offline && <InlineMessage tone="waiting" icon="offline" title={s.offline} />}
    </ScreenBody>
  );
}
