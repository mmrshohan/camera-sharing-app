// Builds the web outputs from the DTCG token sources in tokens/.
// Writes src/tokens/generated/tokens.css (custom properties) and tokens.ts (typed constants).
// Generated files are not committed; dev, build and check run this first.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { androidLargestSp } from "../src/tokens/scale.ts";

type Json = Record<string, unknown>;
type Platform = "ios" | "android";
const typeStyles = [
  "numeral",
  "largeTitle",
  "title2",
  "title3",
  "headline",
  "body",
  "subheadline",
  "footnote",
  "label",
  "ringLabel",
] as const;

export interface TypeSpec {
  family: string;
  size: number;
  line: number;
  weight: number;
  tracking: number;
}

export interface TokenModel {
  color: Record<"light" | "dark", Record<string, string>>;
  /** What each color is for, from its $description in the light token file. */
  colorUse: Record<string, string>;
  label: Record<"light" | "dark", Record<string, { fg: string; bg: string }>>;
  type: Record<Platform, Record<"default" | "largest", Record<string, TypeSpec>>>;
  space: Record<string, number>;
  margin: Record<Platform, number>;
  target: Record<Platform, number>;
  shape: Record<string, number>;
  fieldHeight: Record<Platform, number>;
  motion: {
    spring: Record<string, { response: number; dampingFraction: number }>;
    pressScale: { ring: number; button: number };
    pressDownMs: number;
    dip: { peak: number; ms: number };
    develop: { blur: number; saturation: number; ms: number; easing: number[] };
    pulse: { scale: number; ms: number };
    live: { min: number; periodMs: number };
    waiting: { arc: number; periodMs: number };
    dim: number;
    fadeMs: number;
  };
}

export type TokenSources = Record<
  "colorLight" | "colorDark" | "typeIos" | "typeAndroid" | "space" | "shape" | "motion",
  Json
>;

const files: Record<keyof TokenSources, string> = {
  colorLight: "color.light.tokens.json",
  colorDark: "color.dark.tokens.json",
  typeIos: "type.ios.tokens.json",
  typeAndroid: "type.android.tokens.json",
  space: "space.tokens.json",
  shape: "shape.tokens.json",
  motion: "motion.tokens.json",
};

export function loadTokenSources(dir: URL): TokenSources {
  const entries = Object.entries(files).map(([key, name]) => [
    key,
    JSON.parse(readFileSync(new URL(name, dir), "utf8")) as Json,
  ]);
  return Object.fromEntries(entries) as TokenSources;
}

function at(root: Json, path: string): Json {
  let node: unknown = root;
  for (const part of path.split(".")) {
    if (typeof node !== "object" || node === null || !(part in node)) {
      throw new Error(`Missing token "${path}"`);
    }
    node = (node as Json)[part];
  }
  return node as Json;
}

function valueOf(root: Json, path: string): unknown {
  let token = at(root, path);
  // DTCG aliases look like "{type.family.text}"; resolve them inside the same file.
  for (let depth = 0; typeof token.$value === "string" && /^\{.+\}$/.test(token.$value); depth++) {
    if (depth > 8) throw new Error(`Alias loop at "${path}"`);
    token = at(root, token.$value.slice(1, -1));
  }
  if (!("$value" in token)) throw new Error(`"${path}" is a group, not a token`);
  return token.$value;
}

function dimension(root: Json, path: string): number {
  const v = valueOf(root, path) as { value: number; unit: string };
  if (v.unit !== "px") throw new Error(`"${path}" must be in px`);
  return v.value;
}

function duration(root: Json, path: string): number {
  const v = valueOf(root, path) as { value: number; unit: string };
  if (v.unit !== "ms") throw new Error(`"${path}" must be in ms`);
  return v.value;
}

function number(root: Json, path: string): number {
  const v = valueOf(root, path);
  if (typeof v !== "number") throw new Error(`"${path}" must be a number`);
  return v;
}

function color(root: Json, path: string): string {
  const v = valueOf(root, path) as { hex: string; alpha?: number };
  const hex = v.hex.toUpperCase();
  if (v.alpha === undefined || v.alpha === 1) return hex;
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${v.alpha})`;
}

function family(root: Json, path: string): string {
  const v = valueOf(root, path);
  const list = Array.isArray(v) ? (v as string[]) : [String(v)];
  return list
    .map((name) => (/^[-a-z]+$/i.test(name) && !name.includes(" ") ? name : `"${name}"`))
    .join(", ");
}

function keysOf(root: Json, path: string): string[] {
  return Object.keys(at(root, path)).filter((k) => !k.startsWith("$"));
}

function typeSpec(root: Json, base: string): TypeSpec {
  return {
    family: family(root, `${base}.family`),
    size: dimension(root, `${base}.size`),
    line: dimension(root, `${base}.line`),
    weight: number(root, `${base}.weight`),
    tracking: dimension(root, `${base}.tracking`),
  };
}

const round2 = (n: number) => Math.round(n * 100) / 100;

export function buildModel(src: TokenSources): TokenModel {
  // Both themes must define exactly the same tokens.
  for (const group of ["color", "label"]) {
    const light = keysOf(src.colorLight, group).join();
    const dark = keysOf(src.colorDark, group).join();
    if (light !== dark) throw new Error(`Light and dark "${group}" tokens differ`);
  }
  const themeColors = (root: Json) =>
    Object.fromEntries(keysOf(root, "color").map((k) => [k, color(root, `color.${k}`)]));
  const themeLabels = (root: Json) =>
    Object.fromEntries(
      keysOf(root, "label").map((k) => [
        k,
        { fg: color(root, `label.${k}.fg`), bg: color(root, `label.${k}.bg`) },
      ]),
    );

  const ios = (size: "default" | "largest") =>
    Object.fromEntries(typeStyles.map((s) => [s, typeSpec(src.typeIos, `type.${size}.${s}`)]));
  const androidDefault = Object.fromEntries(
    typeStyles.map((s) => [s, typeSpec(src.typeAndroid, `type.default.${s}`)]),
  );
  const androidLargest = Object.fromEntries(
    Object.entries(androidDefault).map(([s, spec]) => [
      s,
      s === "numeral"
        ? spec
        : {
            ...spec,
            size: round2(androidLargestSp(spec.size)),
            line: round2(androidLargestSp(spec.line)),
          },
    ]),
  );

  const m = src.motion;
  const spring = (name: string) => ({
    response: number(m, `motion.spring.${name}.response`),
    dampingFraction: number(m, `motion.spring.${name}.dampingFraction`),
  });
  const colorUse = Object.fromEntries(
    keysOf(src.colorLight, "color").map((k) => [
      k,
      String(at(src.colorLight, `color.${k}`).$description ?? ""),
    ]),
  );
  return {
    color: { light: themeColors(src.colorLight), dark: themeColors(src.colorDark) },
    colorUse,
    label: { light: themeLabels(src.colorLight), dark: themeLabels(src.colorDark) },
    type: {
      ios: { default: ios("default"), largest: ios("largest") },
      android: { default: androidDefault, largest: androidLargest },
    },
    space: Object.fromEntries(
      keysOf(src.space, "space").map((k) => [k, dimension(src.space, `space.${k}`)]),
    ),
    margin: {
      ios: dimension(src.space, "margin.ios"),
      android: dimension(src.space, "margin.android"),
    },
    target: {
      ios: dimension(src.space, "target.ios"),
      android: dimension(src.space, "target.android"),
    },
    shape: Object.fromEntries(
      keysOf(src.shape, "shape").map((k) => [k, dimension(src.shape, `shape.${k}`)]),
    ),
    fieldHeight: {
      ios: dimension(src.shape, "fieldHeight.ios"),
      android: dimension(src.shape, "fieldHeight.android"),
    },
    motion: {
      spring: Object.fromEntries(keysOf(m, "motion.spring").map((k) => [k, spring(k)])),
      pressScale: {
        ring: number(m, "motion.pressScale.ring"),
        button: number(m, "motion.pressScale.button"),
      },
      pressDownMs: duration(m, "motion.pressDown"),
      dip: { peak: number(m, "motion.dip.peak"), ms: duration(m, "motion.dip.duration") },
      develop: {
        blur: dimension(m, "motion.develop.blur"),
        saturation: number(m, "motion.develop.saturation"),
        ms: duration(m, "motion.develop.duration"),
        easing: valueOf(m, "motion.develop.easing") as number[],
      },
      pulse: { scale: number(m, "motion.pulse.scale"), ms: duration(m, "motion.pulse.duration") },
      live: { min: number(m, "motion.live.min"), periodMs: duration(m, "motion.live.period") },
      waiting: {
        arc: number(m, "motion.waiting.arc"),
        periodMs: duration(m, "motion.waiting.period"),
      },
      dim: number(m, "motion.dim"),
      fadeMs: duration(m, "motion.fade"),
    },
  };
}

const kebab = (s: string) => s.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const px = (n: number) => `${n}px`;

function block(selector: string, vars: [string, string | number][]): string {
  return `${selector} {\n${vars.map(([k, v]) => `  --${k}: ${v};`).join("\n")}\n}\n`;
}

function typeVars(styles: Record<string, TypeSpec>): [string, string | number][] {
  return Object.entries(styles).flatMap(([name, s]) => [
    [`type-${kebab(name)}-family`, s.family],
    [`type-${kebab(name)}-size`, px(s.size)],
    [`type-${kebab(name)}-line`, px(s.line)],
    [`type-${kebab(name)}-weight`, s.weight],
    [`type-${kebab(name)}-tracking`, px(s.tracking)],
  ]);
}

export function renderCss(model: TokenModel): string {
  const colorVars = (theme: "light" | "dark"): [string, string][] => [
    ...Object.entries(model.color[theme]).map(([k, v]): [string, string] => [
      `color-${kebab(k)}`,
      v,
    ]),
    ...Object.entries(model.label[theme]).flatMap(([k, v]): [string, string][] => [
      [`label-${kebab(k)}-fg`, v.fg],
      [`label-${kebab(k)}-bg`, v.bg],
    ]),
  ];
  const platformVars = (p: Platform): [string, string | number][] => [
    ...typeVars(model.type[p].default),
    ["margin", px(model.margin[p])],
    ["target", px(model.target[p])],
    ["field-height", px(model.fieldHeight[p])],
  ];
  const mo = model.motion;
  const shared: [string, string | number][] = [
    ...Object.entries(model.space).map(([k, v]): [string, string] => [`space-${k}`, px(v)]),
    ...Object.entries(model.shape).map(([k, v]): [string, string] => [kebab(k), px(v)]),
    ["press-scale-ring", mo.pressScale.ring],
    ["press-scale-button", mo.pressScale.button],
    ["motion-press-duration", `${mo.pressDownMs}ms`],
    ["motion-press-easing", "cubic-bezier(0, 0, 0.58, 1)"],
    ["motion-dip-duration", `${mo.dip.ms}ms`],
    ["motion-dip-peak", mo.dip.peak],
    ["motion-develop-duration", `${mo.develop.ms}ms`],
    ["motion-develop-easing", `cubic-bezier(${mo.develop.easing.join(", ")})`],
    ["motion-develop-blur", px(mo.develop.blur)],
    ["motion-develop-saturation", mo.develop.saturation],
    ["motion-pulse-duration", `${mo.pulse.ms}ms`],
    ["motion-pulse-scale", mo.pulse.scale],
    ["motion-live-duration", `${mo.live.periodMs}ms`],
    ["motion-live-min", mo.live.min],
    ["motion-waiting-duration", `${mo.waiting.periodMs}ms`],
    ["motion-waiting-arc", mo.waiting.arc],
    ["motion-dim", mo.dim],
    ["motion-fade-duration", `${mo.fadeMs}ms`],
  ];
  return [
    "/* Generated from tokens/*.tokens.json by scripts/build-tokens.ts. Do not edit. */\n",
    block(':root,\n[data-theme="light"]', colorVars("light")),
    block('[data-theme="dark"]', colorVars("dark")),
    block(':root,\n[data-platform="ios"]', platformVars("ios")),
    block('[data-platform="android"]', platformVars("android")),
    block('[data-platform="ios"][data-text-size="largest"]', typeVars(model.type.ios.largest)),
    block(
      '[data-platform="android"][data-text-size="largest"]',
      typeVars(model.type.android.largest),
    ),
    block(":root", shared),
  ].join("\n");
}

export function renderTs(model: TokenModel): string {
  return [
    "// Generated from tokens/*.tokens.json by scripts/build-tokens.ts. Do not edit.",
    `export const tokens = ${JSON.stringify(model, null, 2)} as const;`,
    "",
  ].join("\n");
}

function main(): void {
  const root = new URL("..", import.meta.url);
  const model = buildModel(loadTokenSources(new URL("tokens/", root)));
  const out = new URL("src/tokens/generated/", root);
  mkdirSync(fileURLToPath(out), { recursive: true });
  writeFileSync(new URL("tokens.css", out), renderCss(model));
  writeFileSync(new URL("tokens.ts", out), renderTs(model));
  console.log("tokens: wrote src/tokens/generated/tokens.css and tokens.ts");
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
