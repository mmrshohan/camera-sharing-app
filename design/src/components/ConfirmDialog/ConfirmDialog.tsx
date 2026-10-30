import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "motion/react";
import { useRef } from "react";
import { useReturnFocus } from "@shared/focus";
import { useShouldReduceMotion, useSurface } from "@shared/surface";
import { springToMotion, tokens } from "@tokens";
import "./ConfirmDialog.css";

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  /** The safe answer. It always has focus when the dialog opens (D8). */
  cancelLabel: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  container: HTMLElement | null;
}

const { motion: m } = tokens;
const rise = springToMotion(m.spring.panel);
const fade = { duration: m.fadeMs / 1000 };

/**
 * Asks before something that matters. On iOS, destructive questions are an action sheet and
 * others an alert; on Android, a Material alert dialog. Focus starts on the safe answer.
 */
export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel,
  destructive = false,
  onConfirm,
  onCancel,
  container,
}: ConfirmDialogProps) {
  const { platform } = useSurface();
  const reduceMotion = useShouldReduceMotion();
  const focus = useReturnFocus();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const sheet = platform === "ios" && destructive;
  const away = reduceMotion ? { opacity: 0 } : sheet ? { y: "100%" } : { opacity: 0, scale: 1.08 };

  const text = (
    <div className="confirm__text">
      <Dialog.Title className="confirm__title">{title}</Dialog.Title>
      <Dialog.Description className="confirm__message">{message}</Dialog.Description>
    </div>
  );
  const confirm = (
    <button
      type="button"
      className={`confirm__action${destructive ? " confirm__action--destructive" : ""}`}
      onClick={onConfirm}
    >
      {confirmLabel}
    </button>
  );
  const cancel = (
    <button
      ref={cancelRef}
      type="button"
      className="confirm__action confirm__action--cancel"
      onClick={onCancel}
    >
      {cancelLabel}
    </button>
  );

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        if (!next) onCancel();
      }}
    >
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount container={container}>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                className="confirm-scrim"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={fade}
              />
            </Dialog.Overlay>
            <Dialog.Content
              asChild
              forceMount
              role="alertdialog"
              onOpenAutoFocus={(event) => {
                focus.remember();
                event.preventDefault();
                cancelRef.current?.focus();
              }}
              onCloseAutoFocus={focus.restore}
              onPointerDownOutside={(event) => {
                // An iOS alert waits for an answer; sheets and Material dialogs cancel.
                if (platform === "ios" && !sheet) event.preventDefault();
              }}
            >
              <motion.div
                className={`confirm confirm--${sheet ? "sheet" : "alert"}`}
                initial={away}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={away}
                transition={sheet && !reduceMotion ? rise : fade}
              >
                {sheet ? (
                  <>
                    <div className="confirm__group">
                      {text}
                      {confirm}
                    </div>
                    <div className="confirm__group">{cancel}</div>
                  </>
                ) : (
                  <>
                    {text}
                    <div className="confirm__actions">
                      {cancel}
                      {confirm}
                    </div>
                  </>
                )}
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
