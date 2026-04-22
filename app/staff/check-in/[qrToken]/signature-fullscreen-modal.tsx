"use client";

import { AnimatePresence, motion } from "framer-motion";
import SignaturePad from "./signature-pad";

type SignatureFullscreenModalProps = {
  open: boolean;
  onClose: () => void;
  onChange: (value: string) => void;
};

export default function SignatureFullscreenModal({
  open,
  onClose,
  onChange,
}: SignatureFullscreenModalProps) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[96] flex max-h-screen items-center justify-center overflow-hidden bg-black/50 px-4 py-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.section
            className="w-full max-w-5xl overflow-hidden rounded-2xl border border-white/20 bg-[#f7f7f7] p-4 shadow-2xl md:p-6"
            initial={{ opacity: 0, y: 14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--accent-orange)]">
                  Signature Mode
                </p>
                <p className="mt-1 text-sm text-gray-700">
                  Sign comfortably in full-screen mode.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700"
              >
                Done
              </button>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-3 md:p-5">
              <SignaturePad
                onChange={onChange}
                height={700}
                displayHeightClass="h-[360px] md:h-[460px]"
              />
            </div>
          </motion.section>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
