const minute = 60_000;
const hour = 60 * minute;

/** How long each step takes on a good connection. */
export const timing = {
  prepareMs: 700,
  uploadMs: 1200,
  downloadMs: 1000,
  saveMs: 800,
  checkUsernameMs: 600,
  /** The camera is busy for a moment after each capture; a tap then is refused (R10). */
  captureMs: 300,
  /** How long a refusal's toast stays. */
  toastMs: 3000,
} as const;

/**
 * Policy defaults from the product requirements (01) and specification 06, all pending approval.
 * The request expiry is my call; a slow network makes transfers take three times as long.
 */
export const limits = {
  /** A session lasts at most two hours… */
  sessionMs: 2 * hour,
  /** …and ends 15 minutes after the last photo. */
  idleMs: 15 * minute,
  /** An unsent photo, and the relay's copy, expire 72 hours after capture or reservation. */
  photoMs: 72 * hour,
  /** An invitation or connection request nobody answers. */
  requestMs: 5 * minute,
  /** Pending photos on Alex's phone. */
  queue: 100,
  slowFactor: 3,
} as const;
