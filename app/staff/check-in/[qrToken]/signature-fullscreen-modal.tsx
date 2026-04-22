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
          className="fixed inset-0 z-[96] bg-[#f7f7f7]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="mx-auto flex h-screen w-full max-w-4xl flex-col px-4 py-5 md:px-6">
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

            <div className="flex-1 rounded-2xl border border-gray-200 bg-white p-3 md:p-5">
              <SignaturePad onChange={onChange} height={520} />
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
