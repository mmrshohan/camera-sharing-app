import "./switch-track.css";

/** The platform's switch, drawn: UISwitch on iOS, the Material 3 switch on Android. Visual only. */
export function SwitchTrack({ checked }: { checked: boolean }) {
  return (
    <span className="switch-track" data-checked={checked} aria-hidden="true">
      <span className="switch-track__thumb" />
    </span>
  );
}
