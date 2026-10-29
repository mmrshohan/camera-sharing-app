// One of Sarah's photos, large.

export const strings = {
  from: (name: string) => `From ${name}`,
  save: "Save to Photos",
  saving: "Saving…",
  delete: "Delete from this app…",
  accessTitle: "Photos access is off",
  accessBody: "Turn it on in Settings to save photos you receive.",
  openSettings: "Open Settings",
  checkTitle:
    "Check Photos before saving again. An interrupted save may have finished, so saving again could create a duplicate.",
  openPhotos: "Open Photos",
  saveAnother: "Save another copy",
  deleteTitle: "Delete from this app?",
  deleteSaved: "The copy in Photos isn’t affected.",
  deleteOnlyHere: "This photo is only in this app, so deleting it can’t be undone.",
  delete2: "Delete",
  cancel: "Cancel",
} as const;

/** Promises about saving and deleting (R5, R11). */
export const trust = ["checkTitle", "deleteSaved", "deleteOnlyHere"] as const;
