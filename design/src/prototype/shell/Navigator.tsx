import { useEffect, useRef } from "react";
import { scenarios } from "@prototype/scenarios/catalog";
import { journeyNames, journeys } from "@prototype/scenarios/types";

/** Every scenario, by journey. Each is a link, so a state can be opened in a new tab or shared. */
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

  // A shared link may open far down the list. Only the list scrolls, never the page.
  useEffect(() => {
    const list = nav.current;
    const item = list?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!list || !item) return;
    const top = item.offsetTop - list.offsetTop;
    if (top + item.offsetHeight > list.clientHeight) list.scrollTop = top - list.clientHeight / 3;
  }, []);

  return (
    <nav ref={nav} className="proto-nav" aria-label="Scenarios">
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
                    onClick={(event) => {
                      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                      event.preventDefault();
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
