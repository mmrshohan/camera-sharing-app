import "./SectionHeader.css";

export interface SectionHeaderProps {
  title: string;
  /** A short count or note on the right, such as "12 photos". */
  detail?: string;
}

/** Names a section of a screen, such as a day in the photo grid. */
export function SectionHeader({ title, detail }: SectionHeaderProps) {
  return (
    <div className="section-header">
      <h2 className="section-header__title">{title}</h2>
      {detail && <span className="section-header__detail">{detail}</span>}
    </div>
  );
}
