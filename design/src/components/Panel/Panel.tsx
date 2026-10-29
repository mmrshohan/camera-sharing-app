import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion, useDragControls, type PanInfo } from "motion/react";
import type { ReactNode, RefObject } from "react";
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
                if (initialFocus?.current) {
                  event.preventDefault();
                  initialFocus.current.focus();
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
                <div className="panel__body">{children}</div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
