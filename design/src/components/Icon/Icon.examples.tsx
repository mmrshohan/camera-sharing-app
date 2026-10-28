import { icons, type IconName } from "@icons";
import type { Platform } from "@tokens";
import type { Example } from "@workspace/types";
import { Icon } from "./Icon";

const names = Object.keys(icons) as IconName[];

function IconGrid({ filled, platform }: { filled: boolean; platform: Platform }) {
  return (
    <ul className="ex-icon-grid">
      {names.map((name) => (
        <li key={name}>
          <Icon name={name} filled={filled} platform={platform} />
          <span>{name}</span>
          <code>{icons[name].sf}</code>
        </li>
      ))}
    </ul>
  );
}

export const examples: Example[] = [
  {
    id: "outlined",
    title: "Outlined, at rest",
    state: "outlined",
    render: (ctx) => <IconGrid filled={false} platform={ctx.platform} />,
  },
  {
    id: "filled",
    title: "Filled, when selected or inside a ring",
    state: "filled",
    render: (ctx) => <IconGrid filled platform={ctx.platform} />,
  },
  {
    id: "labelled",
    title: "Labelled for screen readers when it stands alone",
    state: "labelled",
    render: (ctx) => (
      <p className="ex-row">
        <Icon name="saved" label="Saved to Photos" platform={ctx.platform} />
        <span>Announced as “Saved to Photos”</span>
      </p>
    ),
  },
];
