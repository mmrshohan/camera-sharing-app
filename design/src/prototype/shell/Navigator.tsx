import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { scenarios } from "@prototype/scenarios/catalog";
import { journeyNames, journeys } from "@prototype/scenarios/types";

/**
 * Every scenario, by journey. Each is a link, so a state can be opened in a new tab or shared.
 * The list is one stop for the Tab key; the arrow keys, Home and End move within it, as in a
 * sidebar, so the toolbar is a few presses away rather than a hundred.
 */
export function Navigator({
  current,
  hrefFor,
  onChoose,
}: {
  current: string;
  hrefFor: (id: string) => string;
  onChoose: (id: string) => void;
}) {
  const nav = useRef<HTMLElement>(null);
  // The link Tab stops at: the scenario shown, or the last one the arrow keys reached.
  const [stop, setStop] = useState(current);

  // A shared link may open far down the list. Only the list scrolls, never the page.
  useEffect(() => {
    const list = nav.current;
    const item = list?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!list || !item) return;
    const top = item.offsetTop - list.offsetTop;
    if (top + item.offsetHeight > list.clientHeight) list.scrollTop = top - list.clientHeight / 3;
  }, []);

  const move = (event: KeyboardEvent<HTMLElement>) => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    const links = [...(nav.current?.querySelectorAll<HTMLAnchorElement>("a") ?? [])];
    const at = links.findIndex((link) => link === document.activeElement);
    const targets: Partial<Record<string, number>> = {
      ArrowDown: at + 1,
      ArrowUp: at - 1,
      Home: 0,
      End: links.length - 1,
    };
    const to = targets[event.key];
    if (at < 0 || to === undefined) return;
    event.preventDefault();
    links[Math.min(Math.max(to, 0), links.length - 1)]?.focus();
  };

  return (
    <nav ref={nav} className="proto-nav" aria-label="Scenarios" onKeyDown={move}>
      {journeys.map((journey) => (
        <section key={journey} className="proto-nav__group">
          <h2 className="proto-nav__title">{journeyNames[journey]}</h2>
          <ul className="proto-nav__list">
            {scenarios
              .filter((s) => s.journey === journey)
              .map((s) => (
                <li key={s.id}>
                  <a
                    href={hrefFor(s.id)}
                    aria-current={s.id === current ? "page" : undefined}
                    tabIndex={s.id === stop ? 0 : -1}
                    onFocus={() => setStop(s.id)}
                    onClick={(event) => {
                      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                      event.preventDefault();
                      setStop(s.id);
                      onChoose(s.id);
                    }}
                  >
                    {s.title}
                  </a>
                </li>
              ))}
          </ul>
        </section>
      ))}
    </nav>
  );
}
