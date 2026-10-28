// The rendering surface a component sits on: platform, theme, text size and reduced motion.
// Workspace previews (PreviewScope) and device frames (DeviceFrame) provide it; components read
// it, so they never depend on the workspace or the prototype.
import "@fontsource/roboto/latin-400.css";
import "@fontsource/roboto/latin-500.css";
import "@fontsource/roboto/latin-700.css";
import { useReducedMotion } from "motion/react";
import { createContext, useContext, type HTMLAttributes, type ReactNode } from "react";
import type { Platform, TextSize, Theme } from "@tokens";
import "./surface.css";

export interface Surface {
  platform: Platform;
  theme: Theme;
  textSize: TextSize;
  reduceMotion: boolean;
}

export const defaultSurface: Surface = {
  platform: "ios",
  theme: "light",
  textSize: "default",
  reduceMotion: false,
};

const SurfaceContext = createContext<Surface>(defaultSurface);

export function useSurface(): Surface {
  return useContext(SurfaceContext);
}

/** True when the operating system or the surface asks for reduced motion. */
export function useShouldReduceMotion(): boolean {
  const system = useReducedMotion();
  return Boolean(system) || useSurface().reduceMotion;
}

export interface SurfaceScopeProps extends HTMLAttributes<HTMLDivElement> {
  surface: Surface;
  children: ReactNode;
}

/** Sets the token selectors (data-platform, data-theme, data-text-size) and the context together. */
export function SurfaceScope({ surface, children, className, ...rest }: SurfaceScopeProps) {
  return (
    <SurfaceContext.Provider value={surface}>
      <div
        {...rest}
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
