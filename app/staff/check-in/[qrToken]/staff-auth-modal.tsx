"use client";

import { FormEvent, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IconEye, IconEyeOff, IconLock } from "@tabler/icons-react";


type StaffAuthModalProps = {
  open: boolean; // Controls whether the modal is visible
  loading?: boolean;
  error?: string;
  onSubmit: (password: string) => Promise<void>;
};

export default function StaffAuthModal({
  open,
  loading = false,
  error = "",
  onSubmit,
}: StaffAuthModalProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSubmit(password);
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/55 px-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.section
            className="w-full max-w-md rounded-2xl border border-white/20 bg-white p-6 shadow-2xl"
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-[#f5d2b6] bg-[#fff7f1] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--accent-orange)]">
              <IconLock size={14} />
              Staff Access
            </div> {/* Decorative badge for staff access */}
            <h2 className="mt-4 text-2xl font-semibold text-gray-800">
              Enter password to continue check-in
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              This attendee profile is protected. Only authorized TMF staff can
              view and confirm check-in.
            </p>

            <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
              <label className="block text-sm font-medium text-gray-700">
                Staff password
                <div className="relative mt-1.5">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 pr-11"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 inline-flex items-center px-3 text-gray-500"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                  </button>
                </div>
              </label>

              {error ? <p className="text-sm text-red-600">{error}</p> : null}

                <motion.button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-[var(--accent-orange)] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60 transition-colors hover:bg-opacity-90"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? "Verifying..." : "Continue to check-in"}
                </motion.button>
            </form>
          </motion.section>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
