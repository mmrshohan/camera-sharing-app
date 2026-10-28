import { contrastRatio, tokens, type ColorName, type LabelKind, type Theme } from "@tokens";
import contrastPairs from "../../../tokens/contrast-pairs.json";

export interface ContrastPair {
  fg: string;
  bg: string;
  min: number;
  note: string;
}

export const pairs: ContrastPair[] = contrastPairs.pairs;

/** Resolves "color.ink", "label.saved.fg" or a literal "#FFFFFF" to a hex value for a theme. */
export function resolveColor(ref: string, theme: Theme): string {
  if (ref.startsWith("#")) return ref;
  const [group, name, part] = ref.split(".");
  if (group === "color") return tokens.color[theme][name as ColorName];
  if (group === "label") return tokens.label[theme][name as LabelKind][part as "fg" | "bg"];
  throw new Error(`Unknown color reference "${ref}"`);
}

export function measure(pair: ContrastPair, theme: Theme): { ratio: number; passes: boolean } {
  const ratio = contrastRatio(resolveColor(pair.fg, theme), resolveColor(pair.bg, theme));
  return { ratio, passes: ratio >= pair.min };
}

export const formatRatio = (ratio: number) => ratio.toFixed(2);
