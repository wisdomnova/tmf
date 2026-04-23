"use client";

import { AnimatePresence, motion } from "framer-motion";
import { IconCircleCheck } from "@tabler/icons-react";


type CheckInSuccessModalProps = {
  open: boolean; // Controls modal visibility
  attendeeName: string;
  eventTitle: string;
  onClose: () => void;
};

export default function CheckInSuccessModal({
  open,
  attendeeName,
  eventTitle,
  onClose,
}: CheckInSuccessModalProps) {
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
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <div className="mx-auto inline-flex rounded-full border border-emerald-200 bg-emerald-50 p-3 text-emerald-600">
              <IconCircleCheck size={28} stroke={2.2} />
            </div>
            <h2 className="mt-4 text-2xl font-semibold text-gray-800">
              Check-in successful
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              <span className="font-semibold text-gray-800">{attendeeName}</span> has
              been marked present for {eventTitle}.
            </p>
            <p className="mt-4 text-sm font-semibold text-gray-800">
              Have a great time at the forum.
            </p>
            <motion.button
              type="button"
              className="mt-6 w-full rounded-lg bg-[var(--accent-orange)] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-opacity-90"
              onClick={onClose}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
            >
              Continue
            </motion.button>
          </motion.section>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
