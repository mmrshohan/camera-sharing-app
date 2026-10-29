import { samples } from "@prototype/model/fixtures";
import type { SampleImage } from "@shared/types";

/** Stand-in photos for examples: the prototype's sample crops, in order. */
export const samplePhotos: SampleImage[] = Object.values(samples);

/** The nth photo taken, cycling through the samples; null before the first. */
export function nthSample(count: number): SampleImage | null {
  return count === 0 ? null : (samplePhotos[(count - 1) % samplePhotos.length] ?? null);
}
