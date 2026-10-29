import * as Dialog from "@radix-ui/react-dialog";
import { useRef } from "react";
import { ConfirmDialog } from "@components/ConfirmDialog";
import { MaterialGlyph } from "@components/Icon";
import { useReturnFocus } from "@shared/focus";
import { tokens, type Platform } from "@tokens";
import "./PermissionPrompt.css";

export type PermissionKind = "camera" | "photosAddOnly" | "notifications";

export interface PermissionPromptProps {
  platform: Platform;
  kind: PermissionKind;
  appName: string;
  /** Why the app asks, shown under the iOS title. Android shows none; iOS writes its own for notifications. */
  purpose: string;
  /** False fades the prompt out before it is removed. */
  open?: boolean;
  onAllow: () => void;
  onDeny: () => void;
  /** The device screen it opens in. */
  container: HTMLElement | null;
}

export interface PermissionCopy {
  title: string;
  /** The system's own message, where it writes one instead of the app's purpose. */
  message?: string;
  /** In the order the system shows them: the refusal is first on iOS and last on Android. */
  answers: string[];
}

const iosAsks: Record<PermissionKind, string> = {
  camera: "Access the Camera",
  photosAddOnly: "Add to Your Photos",
  notifications: "Send You Notifications",
};

/** The system's own words for each prompt. */
export function permissionCopy(
  platform: Platform,
  kind: PermissionKind,
  appName: string,
): PermissionCopy {
  if (platform === "ios") {
    return {
      title: `“${appName}” Would Like to ${iosAsks[kind]}`,
      ...(kind === "notifications" && {
        message:
          "Notifications may include alerts, sounds, and icon badges. These can be configured in Settings.",
      }),
      answers: ["Don’t Allow", "Allow"],
    };
  }
  if (kind === "camera") {
    return {
      title: `Allow ${appName} to take pictures and record video?`,
      answers: ["While using the app", "Only this time", "Don’t allow"],
    };
  }
  if (kind === "notifications") {
    return {
      title: `Allow ${appName} to send you notifications?`,
      answers: ["Allow", "Don’t allow"],
    };
  }
  throw new Error("Android saves to MediaStore without a permission prompt");
}

/** The system's permission prompt, drawn as each platform draws it. Focus starts on the refusal. */
export function PermissionPrompt({
  platform,
  kind,
  appName,
  purpose,
  open = true,
  onAllow,
  onDeny,
  container,
}: PermissionPromptProps) {
  const focus = useReturnFocus();
  const denyRef = useRef<HTMLButtonElement>(null);
  if (platform === "android" && kind === "photosAddOnly") {
    // Saving to MediaStore needs no permission, so a screen that asks is a design error.
    if (import.meta.env.DEV)
      throw new Error("Android saves to MediaStore without a permission prompt");
    return null;
  }
  const copy = permissionCopy(platform, kind, appName);

  if (platform === "ios") {
    const [deny = "", allow = ""] = copy.answers;
    return (
      <ConfirmDialog
        open={open}
        title={copy.title}
        message={copy.message ?? purpose}
        cancelLabel={deny}
        confirmLabel={allow}
        onCancel={onDeny}
        onConfirm={onAllow}
        container={container}
      />
    );
  }

  const denyIndex = copy.answers.length - 1;
  const at = copy.title.indexOf(appName);
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        if (!next) onDeny();
      }}
    >
      <Dialog.Portal container={container}>
        <Dialog.Overlay className="permission-scrim" />
        <Dialog.Content
          className="permission"
          role="alertdialog"
          aria-describedby={undefined}
          onOpenAutoFocus={(event) => {
            focus.remember();
            event.preventDefault();
            denyRef.current?.focus();
          }}
          onCloseAutoFocus={focus.restore}
        >
          <span className="permission__icon">
            <MaterialGlyph
              glyph={kind === "camera" ? "photo_camera" : "notifications"}
              filled
              size={tokens.shape.iconBar}
            />
          </span>
          <Dialog.Title className="permission__title">
            {copy.title.slice(0, at)}
            <strong>{appName}</strong>
            {copy.title.slice(at + appName.length)}
          </Dialog.Title>
          <div className="permission__answers">
            {copy.answers.map((answer, index) => (
              <button
                key={answer}
                ref={index === denyIndex ? denyRef : undefined}
                type="button"
                className="permission__answer"
                onClick={index === denyIndex ? onDeny : onAllow}
              >
                {answer}
              </button>
            ))}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
