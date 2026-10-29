// The prototype's model of both phones (design spec §10, Appendix C).
import type { DeviceModel, Party, Words } from "@shared/types";
import type { TextSize, Theme } from "@tokens";

export type {
  CameraCounts,
  DeviceModel,
  Party,
  SampleImage,
  TileStatus,
  Words,
} from "@shared/types";
export type { TextSize, Theme } from "@tokens";

export type DeviceId = "alex" | "sarah";
export type PhotoId = string;
export type SessionId = string;
export type Network = "online" | "slow" | "offline";
export type Connection = "wifi" | "cellular";
export type Permission = "notDetermined" | "granted" | "denied";

/** Where one of Alex's photos is, on his phone (specification 06). */
export type HostStage =
  | "preparing"
  | "prepared"
  | "reserved"
  | "uploading"
  | "uploaded"
  | "delivered"
  | "expired"
  | "canceled";

/** Where one of Sarah's photos is, on her phone (specification 06). */
export type RecipientStage =
  | "arriving"
  | "stored"
  | "exportPending"
  | "saved"
  | "exportUncertain"
  | "actionRequired"
  | "expired"
  | "canceled";

export interface HostPhoto {
  id: PhotoId;
  sessionId: SessionId;
  stage: HostStage;
  /** Authorized to send: by the active session, or by an approved recovery (R6, R7). */
  reserved: boolean;
  /** A recoverable failure: the photo keeps its stage and will try again (R5). */
  retry: boolean;
  capturedAt: number;
  /** When it entered its stage; preparing and uploading finish a set time later. */
  stageAt: number;
  /** When the relay reserved it; the relay's copy expires 72 hours later. */
  reservedAt: number | null;
  /** Capture plus 72 hours: an unsent photo expires then (specification 06). */
  expiresAt: number;
  /** A key of fixtures.samples. */
  sample: string;
}

/** A photo on the relay, between the phones. */
export interface CloudObject {
  photoId: PhotoId;
  sessionId: SessionId;
  stage: "verified" | "downloading" | "receipted" | "expired" | "canceled";
  expiresAt: number;
}

export interface RecipientPhoto {
  id: PhotoId;
  sessionId: SessionId;
  fromName: string;
  stage: RecipientStage;
  /** Download progress from 0 to 1 while arriving. */
  progress: number;
  retry: boolean;
  /** When it was stored on Sarah's phone. */
  arrivedAt: number;
  /** When it entered its stage; downloading and saving finish a set time later. */
  stageAt: number;
  /** A key of fixtures.samples. */
  sample: string;
}

export type HostLabel =
  | "Preparing"
  | "Waiting for internet"
  | "Waiting for Wi-Fi"
  | "Sending"
  | `Ready for ${string}`
  | "Delivered"
  | "Expired"
  | "Canceled";

export type RecipientLabel =
  | "Arriving"
  | "Only in this app"
  | "Saving to Photos"
  | "Saved to Photos"
  | "Photos save needs checking"
  | "Expired, never arrived"
  | "Canceled before arrival";

export type SettingsPage =
  "signin" | "devices" | "blocked" | "storage" | "privacy" | "help" | "report" | "delete";
export type Route =
  | "welcome"
  | "username"
  | "home"
  | "scanner"
  | "camera"
  | "lock"
  | "photo"
  | "settings"
  | `settings/${SettingsPage}`;
export type PanelId = "invitation" | "connect" | "session" | "recovery";
export type ConfirmId =
  "endSession" | "cancelUnsent" | "deleteFromApp" | "signOut" | "deleteAccount";
export type PromptKind = "camera" | "photosAddOnly" | "notifications";
export type SignInMethod = "apple" | "google" | "passkey";

/** Something that just happened, which the screen explains until the next step. */
export type Notice =
  | "signInFailed"
  | "signInCanceled"
  | "cameraInUse"
  | "notAnInvitation"
  | "noMatch"
  | "tooManyRequests"
  | "notAvailable"
  | "cameraInterrupted"
  | "authCanceled"
  | "supportUnavailable"
  | "reportSent"
  | "accountDeleted";

/** What a phone shows. Memory-only parts clear when the app relaunches. */
export interface DeviceUi {
  route: Route;
  panel: PanelId | null;
  confirm: ConfirmId | null;
  prompt: PromptKind | null;
  /** Alex's latest photo of the current session, held in memory only (R3). */
  lastShot: PhotoId | null;
  openPhoto: PhotoId | null;
  /** The photo whose save waits for the answer to the Photos prompt. */
  pendingSave: PhotoId | null;
  toast: string | null;
  notice: Notice | null;
  /** Sarah's invitation code is valid until then; null while none is shown. */
  inviteExpiresAt: number | null;
  /** The camera's controls on Alex's phone. */
  camera: { flash: "off" | "on" | "auto"; zoom: number; facing: "back" | "front" };
  /** A system surface over the app: the Lock Screen or the notification shade. */
  system: "lockScreen" | "notificationShade" | null;
  /** Changes with each capture, dropping the photo into the last-shot well. */
  dropKey: number;
  /** Changes when a photo leaves Alex's phone, pulsing the destination. */
  pulseKey: number;
  /** The username field; `since` is when its state began, for the check's timer. */
  field: { value: string; state: "idle" | "checking" | "valid" | "invalid"; since: number };
}

export interface DeviceState {
  id: DeviceId;
  model: DeviceModel;
  theme: Theme;
  textSize: TextSize;
  signedIn: boolean;
  username: string | null;
  network: Network;
  connection: Connection;
  permissions: Record<PromptKind, Permission>;
  settings: { autoSave: boolean; wifiOnly: boolean; notifications: boolean };
  mode: "normal" | "borrowing";
  /** Sign-in methods, this account's phones and the accounts it has blocked. */
  account: { methods: SignInMethod[]; devices: string[]; blocked: string[] };
  storageFull: boolean;
  busy: boolean;
  ui: DeviceUi;
  hostPhotos: HostPhoto[];
  gallery: RecipientPhoto[];
}

export type SessionState =
  | "requested"
  | "verifying"
  | "active"
  | "ended"
  | "expired"
  | "declined"
  | "mismatch"
  | "deviceChanged";

export interface Session {
  id: SessionId;
  /** Each start again is a new attempt; approvals count only for their own (R2). */
  attempt: number;
  host: Party;
  recipient: Party;
  words: Words;
  state: SessionState;
  approvals: { host: boolean; recipient: boolean; attempt: number };
  startedAt: number | null;
  /** While active: when it ends, two hours after starting or 15 minutes after the last photo. */
  endsAt: number | null;
  endedAt: number | null;
  /** While requested or verifying: when the request expires. */
  expiresAt: number | null;
}

export interface Recovery {
  sessionId: SessionId;
  photoIds: PhotoId[];
  approvals: { host: boolean; recipient: boolean };
  state: "needed" | "approved" | "declined" | "expired";
  /** The photos' original deadline; recovery never extends it (R7). */
  expiresAt: number;
}

export interface World {
  /** Milliseconds since 9:41 on the day the story starts. */
  clock: number;
  devices: Record<DeviceId, DeviceState>;
  session: Session | null;
  cloud: CloudObject[];
  recovery: Recovery | null;
}

type On = { device: DeviceId };
export type WorldEvent =
  | { type: "tick"; ms: number }
  | ({ type: "relaunch" } & On)
  | ({ type: "setNetwork"; network: Network; connection?: Connection } & On)
  | ({ type: "navigate"; route: Route } & On)
  | ({ type: "openPanel"; panel: PanelId } & On)
  | ({ type: "closePanel" } & On)
  | ({ type: "openConfirm"; confirm: ConfirmId } & On)
  | ({ type: "closeConfirm" } & On)
  | ({ type: "openPhoto"; id: PhotoId } & On)
  | ({ type: "closePhoto" } & On)
  | ({ type: "permission"; kind: PromptKind; allow: boolean } & On)
  | ({ type: "requestPermission"; kind: PromptKind } & On)
  | { type: "scanInvitation" }
  | { type: "requestByUsername"; username: string }
  | { type: "approve"; by: DeviceId }
  | { type: "decline"; by: DeviceId }
  | { type: "wordsMismatch" }
  | { type: "deviceChanged" }
  | { type: "startAgain" }
  | { type: "capture" }
  | { type: "endSession" }
  | { type: "cancelUnsent" }
  | { type: "unlock"; success: boolean }
  | ({ type: "retryNetwork" } & On)
  | { type: "approveRecovery"; by: DeviceId }
  | { type: "declineRecovery"; by: DeviceId }
  | { type: "savePhoto"; id: PhotoId }
  | { type: "deleteFromApp"; id: PhotoId }
  | ({ type: "setSetting"; key: "autoSave" | "wifiOnly" | "notifications"; value: boolean } & On)
  | ({ type: "typeField"; value: string } & On)
  | ({ type: "submitUsername" } & On)
  | ({ type: "signOut" } & On)
  | ({ type: "deleteAccount" } & On)
  // The review shell's own controls: how a phone looks, and its system surfaces.
  | ({ type: "setAppearance"; model?: DeviceModel; theme?: Theme; textSize?: TextSize } & On)
  | ({ type: "showSystem"; surface: DeviceUi["system"] } & On);
