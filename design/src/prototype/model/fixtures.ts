import type { Party, SampleImage, Words } from "./types";

const crop = (position: string): SampleImage => ({ src: "/images/coast.jpg", position, zoom: 2.5 });

/** The photos Alex takes: twelve fixed crops of the one sample image (design/ASSETS.md). */
export const samples: Record<string, SampleImage> = {
  "coast-01": crop("30% 60%"),
  "coast-02": crop("75% 35%"),
  "coast-03": crop("50% 85%"),
  "coast-04": crop("20% 15%"),
  "coast-05": crop("85% 10%"),
  "coast-06": crop("10% 40%"),
  "coast-07": crop("65% 55%"),
  "coast-08": crop("90% 65%"),
  "coast-09": crop("35% 90%"),
  "coast-10": crop("80% 90%"),
  "coast-11": crop("50% 30%"),
  "coast-12": crop("15% 75%"),
};

/** Alex lends his camera to Sarah; Maya is someone else Alex might ask. */
export const people: { alex: Party; sarah: Party; maya: Party } = {
  alex: { name: "Alex", handle: "@alex", device: "iPhone 16 Pro" },
  sarah: { name: "Sarah", handle: "@sarah", device: "Galaxy A15" },
  maya: { name: "Maya", handle: "@maya", device: "iPhone 13" },
};

/** Verification words, a new set for each attempt (R2). */
export const wordSets: readonly Words[] = [
  ["maple", "river", "candle", "orbit", "velvet", "sparrow"],
  ["harbor", "linen", "copper", "meadow", "quartz", "willow"],
  ["cedar", "lantern", "pebble", "saffron", "tide", "violet"],
];
