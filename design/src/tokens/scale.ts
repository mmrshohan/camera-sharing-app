// Android's non-linear font scaling at the largest system setting (font scale 2.0).
// Table copied from AOSP frameworks/base FontScaleConverterFactory (verified 28 Oct 2026):
// large text grows less than small text so it still fits on screen.
const fromSp = [8, 10, 12, 14, 18, 20, 24, 30, 100] as const;
const toDp = [16, 20, 24, 26, 30, 34, 36, 38, 100] as const;

/** Converts a size in sp to dp at Android's largest font scale (2.0), interpolating linearly. */
export function androidLargestSp(sp: number): number {
  const first = fromSp[0];
  const last = fromSp[fromSp.length - 1]!;
  if (sp <= first) return sp * (toDp[0] / first);
  if (sp >= last) return sp * (toDp[toDp.length - 1]! / last);
  for (let i = 1; i < fromSp.length; i += 1) {
    const x1 = fromSp[i]!;
    if (sp <= x1) {
      const x0 = fromSp[i - 1]!;
      const y0 = toDp[i - 1]!;
      const y1 = toDp[i]!;
      return y0 + ((sp - x0) / (x1 - x0)) * (y1 - y0);
    }
  }
  return sp; // unreachable: sp is below the last table point here
}
