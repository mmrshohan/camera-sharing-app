import { Children, type ReactNode } from "react";
import "./GroupedList.css";

export interface GroupedListProps {
  header?: string;
  footer?: string;
  /** ListRow elements, one per item. */
  children: ReactNode;
}

/** iOS's inset grouped list; a plain Material list with a colored header on Android. */
export function GroupedList({ header, footer, children }: GroupedListProps) {
  return (
    <section className="grouped-list">
      {header && <h2 className="grouped-list__header">{header}</h2>}
      <ul className="grouped-list__items">
        {Children.toArray(children).map((child, index) => (
          <li key={index}>{child}</li>
        ))}
      </ul>
      {footer && <p className="grouped-list__footer">{footer}</p>}
    </section>
  );
}
