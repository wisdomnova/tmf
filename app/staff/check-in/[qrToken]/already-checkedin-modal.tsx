"use client";

import { AnimatePresence, motion } from "framer-motion";
import { IconShieldCheck } from "@tabler/icons-react";


type AlreadyCheckedInModalProps = {
  open: boolean; // Controls modal visibility
  attendeeName: string;
  checkedInAt: string;
  onClose: () => void;
};

export default function AlreadyCheckedInModal({
  open,
  attendeeName,
  checkedInAt,
  onClose,
}: AlreadyCheckedInModalProps) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[95] flex items-center justify-center bg-black/50 px-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.section
            className="w-full max-w-md rounded-2xl border border-white/20 bg-white p-6 shadow-2xl"
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <div className="mx-auto inline-flex rounded-full border border-[#d9e6ff] bg-[#f2f7ff] p-3 text-[#2c5fb3]">
              <IconShieldCheck size={28} stroke={2.2} />
            </div>
            <h2 className="mt-4 text-2xl font-semibold text-gray-800">
              Already checked in
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              <span className="font-semibold text-gray-800">{attendeeName}</span> has
              already completed check-in.
            </p>
            <p className="mt-2 text-sm text-gray-600">
              Recorded at {new Date(checkedInAt).toLocaleString()}.
            </p>
            <motion.button
              type="button"
              className="mt-6 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
              onClick={onClose}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
            >
              Close
            </motion.button>
          </motion.section>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
