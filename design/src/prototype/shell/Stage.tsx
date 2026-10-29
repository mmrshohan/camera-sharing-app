import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { DeviceId } from "@prototype/model/types";
import { fitScale, stage, type Size } from "./layout";

interface StageValue {
  scale: number;
  sizes: Partial<Record<DeviceId, Size>>;
  /** A phone reports its true size, or null when it leaves the stage. */
  report: (id: DeviceId, size: Size | null) => void;
}

const StageContext = createContext<StageValue | null>(null);

export function useStage(): StageValue {
  const value = useContext(StageContext);
  if (!value) throw new Error("useStage must be used inside a Stage");
  return value;
}

/** Until a phone reports its size: roughly an iPhone 16 Pro in its frame. */
export const assumedSize: Size = { width: 426, height: 898 };

/** The phones, side by side, scaled to fit the space they have and never above true size. */
export function Stage({ children, count }: { children: ReactNode; count: 1 | 2 }) {
  const ref = useRef<HTMLDivElement>(null);
  const [available, setAvailable] = useState<Size | null>(null);
  const [sizes, setSizes] = useState<Partial<Record<DeviceId, Size>>>({});

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;
    const measure = () =>
      setAvailable({
        width: node.clientWidth - stage.padding * 2,
        height: node.clientHeight - stage.padding * 2 - stage.header,
      });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const report = useCallback((id: DeviceId, size: Size | null) => {
    setSizes((current) => {
      const before = current[id];
      if (size && before && before.width === size.width && before.height === size.height)
        return current;
      const next = { ...current };
      if (size) next[id] = size;
      else delete next[id];
      return next;
    });
  }, []);

  const known = Object.values(sizes);
  const phones = Array.from({ length: count }, (_, i) => known[i] ?? assumedSize);
  const scale = available ? fitScale(available, phones, stage.gap) : 0.5;

  return (
    <div ref={ref} className="proto-stage" data-scale={scale.toFixed(3)}>
      <StageContext.Provider value={{ scale, sizes, report }}>
        <div className="proto-phones">{children}</div>
      </StageContext.Provider>
    </div>
  );
}
