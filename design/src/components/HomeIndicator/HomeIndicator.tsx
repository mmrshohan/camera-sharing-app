import "./HomeIndicator.css";

export interface HomeIndicatorProps {
  kind: "homeIndicator" | "gestureBar" | "threeButton";
}

/** The bottom of the screen: iOS's home indicator, Android's gesture bar or three buttons. */
export function HomeIndicator({ kind }: HomeIndicatorProps) {
  if (kind === "threeButton") {
    return (
      <div className="home-indicator home-indicator--buttons" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path d="M17 5v14L6 12Z" />
        </svg>
        <svg viewBox="0 0 24 24" width="24" height="24">
          <circle cx="12" cy="12" r="7" />
        </svg>
        <svg viewBox="0 0 24 24" width="24" height="24">
          <rect x="6" y="6" width="12" height="12" rx="2" />
        </svg>
      </div>
    );
  }
  return <div className={`home-indicator home-indicator--${kind}`} aria-hidden="true" />;
}
