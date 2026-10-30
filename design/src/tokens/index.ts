// The single entry point for design values in code. Values come from tokens/*.tokens.json
// through the generator; components use CSS variables and read this only for motion and logic.
import { tokens } from "./generated/tokens";
import "./generated/tokens.css";

export { tokens };
export { androidLargestSp } from "./scale";
export { contrastRatio, springToMotion, type Spring } from "./helpers";

export type Platform = "ios" | "android";
export type Theme = "light" | "dark";
export type TextSize = "default" | "largest";
export type ColorName = keyof (typeof tokens)["color"]["light"];
export type LabelKind = keyof (typeof tokens)["label"]["light"];
export type TypeStyle = keyof (typeof tokens)["type"]["ios"]["default"];
export type SpringName = keyof (typeof tokens)["motion"]["spring"];

export interface TypeSpec {
  family: string;
  size: number;
  line: number;
  weight: number;
  tracking: number;
}
