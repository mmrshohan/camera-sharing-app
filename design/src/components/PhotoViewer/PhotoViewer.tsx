import type { ReactNode } from "react";
import { IconButton } from "@components/IconButton";
import type { SampleImage } from "@shared/types";
import "./PhotoViewer.css";

export interface PhotoViewerProps {
  image: SampleImage;
  /** When it was taken, such as "Today, 2:14 PM". */
  title: string;
  /** Where the photo is: usually a StatusLabel. */
  status: ReactNode;
  /** One or two actions, such as Save to Photos. */
  footer: ReactNode;
  onClose: () => void;
}

/** One photo, large, on a dark surround so the photo is the color. */
export function PhotoViewer({ image, title, status, footer, onClose }: PhotoViewerProps) {
  return (
    <section className="photo-viewer" data-theme="dark" aria-label={title}>
      <header className="photo-viewer__bar">
        <IconButton icon="close" label="Close" tone="onCamera" onPress={onClose} />
        <h1 className="photo-viewer__title">{title}</h1>
      </header>
      <div className="photo-viewer__frame">
        <div
          className="photo-viewer__photo"
          role="img"
          aria-label={`Photo, ${title}`}
          style={{
            backgroundImage: `url("${image.src}")`,
            backgroundPosition: image.position,
            backgroundSize: `${image.zoom * 100}%`,
          }}
        />
      </div>
      <div className="photo-viewer__status">{status}</div>
      <footer className="photo-viewer__footer">{footer}</footer>
    </section>
  );
}
