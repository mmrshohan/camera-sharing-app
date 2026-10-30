import { useEffect, useRef } from "react";
import { devices } from "@components/DeviceFrame";
import type { DeviceId, DeviceModel, DeviceState, WorldEvent } from "@prototype/model/types";
import { Segmented } from "@workspace/Segmented";
import type { Simulation } from "./simulations";

const models = Object.values(devices);

/** A phone's name and model, with its review controls in a popover. */
export function DeviceControls({
  id,
  name,
  device,
  dispatch,
  simulations,
}: {
  id: DeviceId;
  name: string;
  device: DeviceState;
  dispatch: (event: WorldEvent) => void;
  /** Things that happen outside the phone, such as a code being scanned. */
  simulations: Simulation[];
}) {
  const trigger = useRef<HTMLButtonElement>(null);
  const popover = useRef<HTMLDivElement>(null);
  const popoverId = `${id}-controls`;

  // Opens under its button, kept inside the window.
  useEffect(() => {
    const node = popover.current;
    if (!node) return;
    const place = (event: Event) => {
      if (!(event instanceof ToggleEvent) || event.newState !== "open" || !trigger.current) return;
      const anchor = trigger.current.getBoundingClientRect();
      const left = Math.min(anchor.left, window.innerWidth - node.offsetWidth - 8);
      node.style.left = `${Math.max(8, left)}px`;
      node.style.top = `${anchor.bottom + 6}px`;
    };
    node.addEventListener("toggle", place);
    return () => node.removeEventListener("toggle", place);
  }, []);

  const set = (patch: Omit<Extract<WorldEvent, { type: "setAppearance" }>, "type" | "device">) =>
    dispatch({ type: "setAppearance", device: id, ...patch });

  return (
    <header className="proto-phone__head">
      <h2 className="proto-phone__name">{name}</h2>
      <span className="proto-phone__model">{devices[device.model].name}</span>
      {/* Named by its word first, so voice control can say what it shows. */}
      <button
        ref={trigger}
        type="button"
        className="proto-button proto-button--menu"
        popoverTarget={popoverId}
        aria-label={`Adjust ${name}'s phone`}
      >
        Adjust
        <svg className="proto-button__chevron" viewBox="0 0 10 6" aria-hidden="true">
          <path d="M1 1l4 4 4-4" />
        </svg>
      </button>
      {simulations.map(({ label, event }) => (
        <button key={label} type="button" className="proto-button" onClick={() => dispatch(event)}>
          {label}
        </button>
      ))}
      <div ref={popover} id={popoverId} popover="auto" className="proto-popover">
        <label className="proto-field">
          <span>Phone</span>
          <select
            value={device.model}
            onChange={(e) => set({ model: e.target.value as DeviceModel })}
          >
            {models.map((spec) => (
              <option key={spec.model} value={spec.model}>
                {spec.name}
              </option>
            ))}
          </select>
        </label>
        <Segmented
          legend="Theme"
          name={`${id}-theme`}
          options={[
            ["light", "Light"],
            ["dark", "Dark"],
          ]}
          value={device.theme}
          onChange={(theme) => set({ theme })}
        />
        <Segmented
          legend="Text size"
          name={`${id}-text`}
          options={[
            ["default", "Default"],
            ["largest", "Largest"],
          ]}
          value={device.textSize}
          onChange={(textSize) => set({ textSize })}
        />
        <Segmented
          legend="Network"
          name={`${id}-network`}
          options={[
            ["online", "Online"],
            ["slow", "Slow"],
            ["offline", "Offline"],
          ]}
          value={device.network}
          onChange={(network) => dispatch({ type: "setNetwork", device: id, network })}
        />
        <Segmented
          legend="Connection"
          name={`${id}-connection`}
          options={[
            ["wifi", "Wi-Fi"],
            ["cellular", "Cellular"],
          ]}
          value={device.connection}
          onChange={(connection) =>
            dispatch({ type: "setNetwork", device: id, network: device.network, connection })
          }
        />
        <label className="ws-switch">
          <span>Show Lock Screen</span>
          <input
            type="checkbox"
            role="switch"
            checked={device.ui.system !== null}
            onChange={(e) =>
              dispatch({
                type: "showSystem",
                device: id,
                surface: e.target.checked ? "lockScreen" : null,
              })
            }
          />
          <span className="ws-switch__track" aria-hidden="true" />
        </label>
        <button
          type="button"
          className="proto-button"
          onClick={() => dispatch({ type: "relaunch", device: id })}
        >
          Relaunch the app
        </button>
      </div>
    </header>
  );
}
