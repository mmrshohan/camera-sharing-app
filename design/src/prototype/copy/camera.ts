// Alex's camera while he lends it. The shutter and the toast say why a tap didn't take a photo.

export const strings = {
  busy: "Camera busy. That tap didn't take a photo.",
  ended: "This session has ended",
  queueFull: "Too many photos waiting. Wait for some to send.",
  storageFull: "This phone is out of space. Free up space to keep taking photos",
  interrupted: "The camera was interrupted",
  endsSoon: (minutes: number) =>
    `Session ends in ${minutes} ${minutes === 1 ? "minute" : "minutes"}`,
  done: "Done",
  flash: { off: "Flash off", on: "Flash on", auto: "Flash auto" },
  flip: "Switch camera",
  lastPhoto: "Last photo",
  lastPhotoNote: "Only your latest photo is shown here, and it goes when you leave the camera.",
} as const;

/** Promises about what stays on Alex's phone (R3). */
export const trust = ["lastPhotoNote"] as const;
