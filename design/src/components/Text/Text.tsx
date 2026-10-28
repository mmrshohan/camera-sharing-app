import type { ReactNode } from "react";
import type { TypeStyle } from "@tokens";
import "./Text.css";

export type TextTone = "ink" | "ink2" | "accentText" | "danger";

export interface TextProps {
  style: TypeStyle;
  as?: "p" | "span" | "h1" | "h2" | "h3";
  tone?: TextTone;
  children: ReactNode;
}

const kebab = (name: string) => name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

/** The platform's own type from the tokens: SF Pro with Dynamic Type, Roboto with font scale. */
export function Text({ style, as: Element = "span", tone = "ink", children }: TextProps) {
  return (
    <Element className={`text text--${kebab(style)} text--tone-${kebab(tone)}`}>{children}</Element>
  );
}
