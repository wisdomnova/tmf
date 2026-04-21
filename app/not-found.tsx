"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import SiteHeader from "../components/site-header";
import SiteFooter from "../components/site-footer";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />

      <main className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-6xl items-center px-6 py-12">
        <motion.section
          className="w-full rounded-3xl border border-gray-200 bg-[#fafafa] px-6 py-12 text-center shadow-sm md:px-10 md:py-16"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent-orange)]">
            Error 404
          </p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight text-gray-900 md:text-6xl">
            Page not found
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-gray-700 md:text-lg">
            The page you are trying to reach does not exist or may have been moved.
            Continue to the homepage or register for TMF 2026.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-800"
            >
              Back to homepage
            </Link>
            <Link
              href="/register"
              className="rounded-lg px-5 py-3 text-sm font-semibold text-white"
              style={{
                background: "linear-gradient(182deg, #E12900 0%, #FA9411 100%)",
              }}
            >
              Register for TMF 2026
            </Link>
          </div>
        </motion.section>
      </main>

      <SiteFooter />
    </div>
  );
}
