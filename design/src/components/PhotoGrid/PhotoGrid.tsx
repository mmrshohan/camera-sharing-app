import { PhotoTile, type PhotoTileProps } from "@components/PhotoTile";
import { SectionHeader } from "@components/SectionHeader";
import "./PhotoGrid.css";

export interface GridSection {
  id: string;
  /** A session or a day, such as "Today". */
  title: string;
  /** Its count, such as "12 photos". */
  detail: string;
  tiles: PhotoTileProps[];
}

export interface PhotoGridProps {
  sections: GridSection[];
}

/** Sarah's photos by session and day: three across, 2 pt apart, edge to edge. */
export function PhotoGrid({ sections }: PhotoGridProps) {
  return (
    <div className="photo-grid">
      {sections.map((section) => (
        <section key={section.id} className="photo-grid__section">
          <SectionHeader title={section.title} detail={section.detail} />
          <ul className="photo-grid__tiles">
            {section.tiles.map((tile, index) => (
              <li key={`${section.id}-${index}`}>
                <PhotoTile {...tile} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
