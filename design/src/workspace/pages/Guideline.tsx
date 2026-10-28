import { Accessibility } from "../guideline/Accessibility";
import { Color } from "../guideline/Color";
import { Icons } from "../guideline/Icons";
import { Labels } from "../guideline/Labels";
import { Motion } from "../guideline/Motion";
import { Platforms } from "../guideline/Platforms";
import { Principles } from "../guideline/Principles";
import { Shape } from "../guideline/Shape";
import { Space } from "../guideline/Space";
import { Type } from "../guideline/Type";
import { Writing } from "../guideline/Writing";
import "../guideline/guideline.css";

const contents = [
  ["principles", "Principles"],
  ["color", "Color"],
  ["labels", "Status labels"],
  ["type", "Type"],
  ["space", "Space and touch"],
  ["shape", "Shape"],
  ["icons", "Icons"],
  ["platforms", "Platforms"],
  ["motion", "Motion"],
  ["writing", "Writing"],
  ["accessibility", "Accessibility"],
] as const;

export function Guideline() {
  return (
    <article className="g-page">
      <p className="ws-eyebrow">
        Product design guideline · v{__DESIGN_VERSION__} · iOS and Android
      </p>
      <h1 className="ws-title">Guideline</h1>
      <p className="ws-lede">
        Very minimal, with one signature: the ring. Every value on this page is read from the design
        tokens, so it can never disagree with the components.
      </p>
      <nav className="g-contents" aria-label="Guideline contents">
        {contents.map(([id, label]) => (
          <a key={id} href={`#${id}`}>
            {label}
          </a>
        ))}
      </nav>
      <Principles />
      <Color />
      <Labels />
      <Type />
      <Space />
      <Shape />
      <Icons />
      <Platforms />
      <Motion />
      <Writing />
      <Accessibility />
    </article>
  );
}
