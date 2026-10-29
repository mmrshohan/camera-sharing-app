// Shapes shared by components and the prototype model.

/** A person in a session, as both phones show them. */
export interface Party {
  name: string;
  /** Their username, with the @. */
  handle: string;
  /** Their phone's exact model, such as "Galaxy A15". */
  device: string;
}

/** The six verification words both phones must show (spec R2). */
export type Words = readonly [string, string, string, string, string, string];

/** A sample photo: one image file shown at a position and zoom, so samples need no extra files. */
export interface SampleImage {
  src: string;
  /** CSS background-position, such as "30% 60%". */
  position: string;
  /** 1 shows the whole image; 2 shows half of it, and so on. */
  zoom: number;
}

/** Alex's photos in a session, by state (design spec, Appendix C). */
export interface CameraCounts {
  sent: number;
  sending: number;
  waitingInternet: number;
  waitingWifi: number;
  preparing: number;
}
