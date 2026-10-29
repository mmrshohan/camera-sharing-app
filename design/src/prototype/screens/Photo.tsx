import { useState } from "react";
import { Button } from "@components/Button";
import { ConfirmDialog } from "@components/ConfirmDialog";
import { devices } from "@components/DeviceFrame";
import { InlineMessage } from "@components/InlineMessage";
import { PhotoViewer } from "@components/PhotoViewer";
import { StatusLabel } from "@components/StatusLabel";
import { strings as s } from "@prototype/copy/photo";
import { samples } from "@prototype/model/fixtures";
import { recipientLabel, withRetry } from "@prototype/model/photos";
import type { DeviceId, RecipientStage } from "@prototype/model/types";
import { useDeviceView } from "@prototype/shell/deviceView";
import type { LabelKind } from "@tokens";

export const screenId = "screens/Photo";

const fallbackSample = { src: "/images/coast.jpg", position: "50% 50%", zoom: 2.5 };

const labelKinds: Record<RecipientStage, LabelKind> = {
  arriving: "sending",
  stored: "neutral",
  exportPending: "sending",
  saved: "saved",
  exportUncertain: "waiting",
  actionRequired: "waiting",
  expired: "neutral",
  canceled: "neutral",
};

/** One of Sarah's photos, large, with where it is and what to do next (R5). */
export function Photo({ id }: { id: DeviceId }) {
  const { device, dispatch, screen } = useDeviceView(id);
  const [askedForAccess, setAskedForAccess] = useState(false);
  const photo = device.gallery.find((p) => p.id === device.ui.openPhoto);
  if (!photo) return null;

  const ios = devices[device.model].platform === "ios";
  const accessOff = ios && device.permissions.photosAddOnly === "denied";
  const save = () => {
    // With access off, saving explains how to turn it on; the app never asks again (D11, R8).
    if (accessOff) setAskedForAccess(true);
    dispatch({ type: "savePhoto", id: photo.id });
  };
  const askDelete = () => dispatch({ type: "openConfirm", device: id, confirm: "deleteFromApp" });
  const deleteButton = (
    <Button variant="destructive" fullWidth onPress={askDelete}>
      {s.delete}
    </Button>
  );
  const uncertain = photo.stage === "exportUncertain" || photo.stage === "actionRequired";

  let footer = null;
  if (photo.stage === "stored") {
    footer = (
      <>
        {askedForAccess && accessOff && (
          <InlineMessage
            tone="neutral"
            icon="save"
            title={s.accessTitle}
            body={s.accessBody}
            // Settings is outside the app; here it stands in for turning access back on there.
            action={{
              label: s.openSettings,
              onPress: () =>
                dispatch({ type: "permission", device: id, kind: "photosAddOnly", allow: true }),
            }}
          />
        )}
        <Button variant="filled" fullWidth onPress={save}>
          {s.save}
        </Button>
        {deleteButton}
      </>
    );
  } else if (photo.stage === "exportPending") {
    footer = (
      <Button variant="filled" fullWidth loading>
        {s.saving}
      </Button>
    );
  } else if (uncertain) {
    // The interrupted save may have finished: check first, or knowingly save a second copy (D9).
    footer = (
      <>
        <InlineMessage
          tone="waiting"
          title={s.checkTitle}
          // The Photos app is outside this one; the action is shown as the phone shows it.
          action={{ label: s.openPhotos, onPress: () => undefined }}
        />
        <Button variant="tinted" fullWidth onPress={save}>
          {s.saveAnother}
        </Button>
        {deleteButton}
      </>
    );
  } else if (photo.stage === "saved") {
    footer = deleteButton;
  }

  return (
    // The viewer is dark, so the phone's bars turn light over it.
    <div className="photo-screen" data-status-bar="light">
      <PhotoViewer
        image={samples[photo.sample] ?? fallbackSample}
        title={s.from(photo.fromName)}
        status={
          <StatusLabel kind={labelKinds[photo.stage]}>
            {withRetry(recipientLabel(photo), photo.retry)}
          </StatusLabel>
        }
        footer={<div className="stack">{footer}</div>}
        onClose={() => dispatch({ type: "closePhoto", device: id })}
      />
      <ConfirmDialog
        open={device.ui.confirm === "deleteFromApp"}
        destructive
        title={s.deleteTitle}
        message={photo.stage === "saved" ? s.deleteSaved : s.deleteOnlyHere}
        confirmLabel={s.delete2}
        cancelLabel={s.cancel}
        onConfirm={() => dispatch({ type: "deleteFromApp", id: photo.id })}
        onCancel={() => dispatch({ type: "closeConfirm", device: id })}
        container={screen}
      />
    </div>
  );
}
