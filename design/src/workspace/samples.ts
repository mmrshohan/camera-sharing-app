import type { SampleImage } from "@shared/types";

/** Stand-in photos for examples: one public-domain-style sample shown at different crops. */
export const samplePhotos: SampleImage[] = [
  { src: "/images/coast.jpg", position: "30% 60%", zoom: 2.5 },
  { src: "/images/coast.jpg", position: "75% 35%", zoom: 2.5 },
  { src: "/images/coast.jpg", position: "50% 85%", zoom: 2.5 },
];

/** The nth photo taken, cycling through the samples; null before the first. */
export function nthSample(count: number): SampleImage | null {
  return count === 0 ? null : (samplePhotos[(count - 1) % samplePhotos.length] ?? null);
}
