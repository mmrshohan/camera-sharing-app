import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion, useDragControls, type PanInfo } from "motion/react";
import { useCallback, useRef, useState, type ReactNode, type RefObject } from "react";
import { useReturnFocus } from "@shared/focus";
import { useShouldReduceMotion } from "@shared/surface";
import { springToMotion, tokens } from "@tokens";
import "./Panel.css";

export interface PanelProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  /** The device screen it opens in. */
  container: HTMLElement | null;
  detent?: "medium" | "large";
  /** When false it closes only through its own actions: no drag, no Escape, no outside tap. */
  dismissible?: boolean;
  /** Where focus lands when it opens; otherwise its first control. */
  initialFocus?: RefObject<HTMLElement | null>;
}

const { motion: m } = tokens;
const rise = springToMotion(m.spring.panel);
const fade = { duration: m.fadeMs / 1000 };

/**
 * Scrolls the body just enough to show where focus starts, its first line first. The browser
 * would center it instead, and cut its first line when it is taller than the body.
 */
function reveal(body: HTMLElement | null, target: HTMLElement): void {
  if (!body?.offsetHeight) return;
  const view = body.getBoundingClientRect();
  const box = target.getBoundingClientRect();
  // Rectangles come at the scale the screen is drawn at; scrollTop is in CSS pixels.
  const scale = view.height / body.offsetHeight;
  const above = (view.top - box.top) / scale;
  const below = (box.bottom - view.bottom) / scale;
  if (above > 0) body.scrollTop -= above;
  else if (below > 0) body.scrollTop += Math.min(below, -above);
}

/**
 * Whether a body's content is taller than the body, kept current as either changes. It follows the
 * body element itself: a panel open before its screen exists is moved into it as a new element.
 */
function useOverflow(): [observe: (body: HTMLElement | null) => void, overflows: boolean] {
  const [overflows, setOverflows] = useState(false);
  const observer = useRef<ResizeObserver | null>(null);
  const observe = useCallback((body: HTMLElement | null) => {
    observer.current?.disconnect();
    observer.current = null;
    if (!body) return;
    observer.current = new ResizeObserver(() =>
      setOverflows(body.scrollHeight > body.clientHeight),
    );
    observer.current.observe(body);
    // The body's one child holds the content, so its size follows the content's.
    if (body.firstElementChild) observer.current.observe(body.firstElementChild);
  }, []);
  return [observe, overflows];
}

/** The system sheet on iOS, Material's modal bottom sheet on Android. Opens inside its screen. */
export function Panel({
  open,
  onClose,
  title,
  children,
  container,
  detent = "medium",
  dismissible = true,
  initialFocus,
}: PanelProps) {
  const reduceMotion = useShouldReduceMotion();
  const drag = useDragControls();
  const focus = useReturnFocus();
  const body = useRef<HTMLDivElement | null>(null);
  const [observe, scrolls] = useOverflow();
  const bodyRef = useCallback(
    (element: HTMLDivElement | null) => {
      body.current = element;
      observe(element);
    },
    [observe],
  );
  const away = reduceMotion ? { opacity: 0 } : { y: "100%" };

  const onDragEnd = (_event: unknown, info: PanInfo) => {
    // Motion reports velocity in pt per second; the token is pt per ms.
    if (info.offset.y > m.dismiss.distance || info.velocity.y > m.dismiss.velocity * 1000) {
      onClose();
    }
  };

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        if (!next && dismissible) onClose();
      }}
    >
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount container={container}>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                className="panel-scrim"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={fade}
              />
            </Dialog.Overlay>
            <Dialog.Content
              asChild
              forceMount
              aria-describedby={undefined}
              onOpenAutoFocus={(event) => {
                focus.remember();
                const target = initialFocus?.current;
                if (target) {
                  event.preventDefault();
                  target.focus({ preventScroll: true });
                  reveal(body.current, target);
                }
              }}
              onCloseAutoFocus={focus.restore}
              onEscapeKeyDown={(event) => {
                if (!dismissible) event.preventDefault();
              }}
              onPointerDownOutside={(event) => {
                if (!dismissible) event.preventDefault();
              }}
            >
              <motion.div
                className={`panel panel--${detent}`}
                initial={away}
                animate={{ y: 0, opacity: 1 }}
                exit={away}
                transition={reduceMotion ? fade : rise}
                drag={dismissible ? "y" : false}
                dragControls={drag}
                dragListener={false}
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={{ top: 0, bottom: 1 }}
                onDragEnd={onDragEnd}
              >
                <div
                  className="panel__handle"
                  aria-hidden="true"
                  onPointerDown={(event) => {
                    if (dismissible) drag.start(event);
                  }}
                >
                  <span className="panel__grabber" />
                </div>
                <Dialog.Title className="panel__title">{title}</Dialog.Title>
                <div
                  ref={bodyRef}
                  className="panel__body"
                  // Content that scrolls can be scrolled from the keyboard, even with no control.
                  {...(scrolls && { tabIndex: 0, role: "region", "aria-label": title })}
                >
                  <div>{children}</div>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
