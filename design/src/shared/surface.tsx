// The rendering surface a component sits on: platform, theme, text size and reduced motion.
// Workspace previews (PreviewScope) and device frames (DeviceFrame) provide it; components read
// it, so they never depend on the workspace or the prototype.
import "@fontsource/roboto/latin-400.css";
import "@fontsource/roboto/latin-500.css";
import "@fontsource/roboto/latin-700.css";
import {
  createContext,
  useContext,
  useSyncExternalStore,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
} from "react";
import type { Platform, TextSize, Theme } from "@tokens";
import "./surface.css";

export interface Surface {
  platform: Platform;
  theme: Theme;
  textSize: TextSize;
  reduceMotion: boolean;
  /** A budget phone (under 4 GB of memory): the develop effect becomes a fade (spec §7.5). */
  lowMemory: boolean;
}

export const defaultSurface: Surface = {
  platform: "ios",
  theme: "light",
  textSize: "default",
  reduceMotion: false,
  lowMemory: false,
};

const SurfaceContext = createContext<Surface>(defaultSurface);

export function useSurface(): Surface {
  return useContext(SurfaceContext);
}

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(onChange: () => void): () => void {
  const media = window.matchMedia(reducedMotionQuery);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

const systemReducesMotion = () => window.matchMedia(reducedMotionQuery).matches;

/** True when the operating system or the surface asks for reduced motion. */
export function useShouldReduceMotion(): boolean {
  // Read directly: motion's own hook logs a development warning whenever the setting is on.
  const system = useSyncExternalStore(subscribeToReducedMotion, systemReducesMotion, () => false);
  const { reduceMotion } = useSurface();
  return system || reduceMotion;
}

export interface SurfaceScopeProps extends HTMLAttributes<HTMLDivElement> {
  surface: Surface;
  children: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

/** Sets the token selectors (data-platform, data-theme, data-text-size) and the context together. */
export function SurfaceScope({ surface, children, className, ref, ...rest }: SurfaceScopeProps) {
  return (
    <SurfaceContext.Provider value={surface}>
      <div
        {...rest}
        ref={ref}
        className={className ? `surface ${className}` : "surface"}
        data-platform={surface.platform}
        data-theme={surface.theme}
        data-text-size={surface.textSize}
        data-reduce-motion={String(surface.reduceMotion)}
      >
        {children}
      </div>
    </SurfaceContext.Provider>
  );
}
