import type { DeviceModel } from "@shared/types";
import type { Platform } from "@tokens";

export type Cutout =
  | { kind: "island"; width: number; height: number; top: number }
  | { kind: "punchHole"; diameter: number; top: number }
  | { kind: "none" };

export interface DeviceSpec {
  model: DeviceModel;
  name: string;
  platform: Platform;
  /** Points on iOS, dp on Android. */
  width: number;
  height: number;
  safeTop: number;
  safeBottom: number;
  statusBar: number;
  cornerRadius: number;
  cutout: Cutout;
  bottom: "homeIndicator" | "homeButton" | "gestureBar" | "threeButton";
  biometric: "faceId" | "touchId" | "fingerprint";
  /** Memory in GB. Under 4, the develop effect becomes a fade (spec §7.5). */
  memoryGb: number;
  /** Fields that are derived or approximate rather than measured. */
  approximate: (keyof DeviceSpec)[];
}

/** The four phones of the prototype (design spec §10). iPhone 16 Pro values checked 28 October. */
export const devices: Record<DeviceModel, DeviceSpec> = {
  iphone16pro: {
    model: "iphone16pro",
    name: "iPhone 16 Pro",
    platform: "ios",
    width: 402,
    height: 874,
    safeTop: 62,
    safeBottom: 34,
    statusBar: 54,
    cornerRadius: 62,
    cutout: { kind: "island", width: 126, height: 37, top: 11 },
    bottom: "homeIndicator",
    biometric: "faceId",
    memoryGb: 8,
    approximate: ["cornerRadius", "cutout"],
  },
  iphoneSE3: {
    model: "iphoneSE3",
    name: "iPhone SE (3rd generation)",
    platform: "ios",
    width: 375,
    height: 667,
    safeTop: 20,
    safeBottom: 0,
    statusBar: 20,
    cornerRadius: 0,
    cutout: { kind: "none" },
    bottom: "homeButton",
    biometric: "touchId",
    memoryGb: 4,
    approximate: [],
  },
  galaxyA15: {
    model: "galaxyA15",
    name: "Galaxy A15",
    platform: "android",
    width: 412,
    height: 891,
    safeTop: 32,
    safeBottom: 48,
    statusBar: 32,
    cornerRadius: 32,
    cutout: { kind: "punchHole", diameter: 22, top: 10 },
    bottom: "threeButton",
    biometric: "fingerprint",
    memoryGb: 4,
    approximate: ["width", "height", "safeTop", "safeBottom", "cornerRadius", "cutout", "memoryGb"],
  },
  androidCompact: {
    model: "androidCompact",
    name: "Compact Android",
    platform: "android",
    width: 360,
    height: 800,
    safeTop: 24,
    safeBottom: 24,
    statusBar: 24,
    cornerRadius: 24,
    cutout: { kind: "none" },
    bottom: "gestureBar",
    biometric: "fingerprint",
    memoryGb: 3,
    approximate: ["cornerRadius", "memoryGb"],
  },
};
