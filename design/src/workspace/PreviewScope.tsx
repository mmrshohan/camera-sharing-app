import type { ReactNode } from "react";
import { SurfaceScope, useSurface } from "@shared/surface";
import type { PreviewContext } from "./types";

/** A preview area in the workspace: a component rendered on a given platform, theme and size. */
export function PreviewScope({
  children,
  className,
  ...surface
}: PreviewContext & { children: ReactNode; className?: string }) {
  return (
    <SurfaceScope
      surface={surface}
      className={className ? `preview ${className}` : "preview"}
      data-testid="preview"
    >
      {children}
    </SurfaceScope>
  );
}

export const usePreview = useSurface;
