import { Fragment } from "react";
import { Icon } from "@components/Icon";
import { icons, type IconName } from "@icons";

const names = Object.keys(icons) as IconName[];

/** Long SF Symbol names may wrap only after a dot, never inside a word. */
function breakAtDots(name: string) {
  return name.split(".").map((part, i, all) => (
    <Fragment key={i}>
      {part}
      {i < all.length - 1 && (
        <>
          .<wbr />
        </>
      )}
    </Fragment>
  ));
}

export function Icons() {
  return (
    <section id="icons" className="g-section" data-testid="guideline-icons">
      <h2>Icons: standard only</h2>
      <p className="g-lede">
        iOS uses SF Symbols; Android uses Material Symbols Rounded. This workspace draws Material
        Symbols for both, because Apple's symbols can't be published in our public repository. Each
        icon records its SF Symbol name for native work.
      </p>
      <ul className="g-icons">
        {names.map((name) => (
          <li key={name} data-testid="icon-row">
            <Icon name={name} size={28} />
            <strong>{name}</strong>
            <span>
              <code className="g-sf">{breakAtDots(icons[name].sf)}</code>
              <code>{icons[name].material}</code>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
