// The prototype's model of both phones (design spec §10, Appendix C).
export type {
  CameraCounts,
  DeviceModel,
  Party,
  SampleImage,
  TileStatus,
  Words,
} from "@shared/types";

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
  reserved: boolean;
  /** A recoverable failure: the photo keeps its stage and will try again (R5). */
  retry: boolean;
  capturedAt: number;
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
  arrivedAt: number;
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
