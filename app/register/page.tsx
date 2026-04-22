"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import SiteHeader from "../../components/site-header";
import SiteFooter from "../../components/site-footer";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />

      <main className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/register.jpg"
            alt="TMF conference registration"
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <section className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-6xl items-center px-6 py-12">
          <div className="grid w-full gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="self-center text-white"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/80">
                TMF 2026
              </p>
              <h1 className="mt-3 max-w-xl text-4xl font-semibold leading-tight md:text-5xl">
                Register for TMF 2026
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-white/90 md:text-lg">
                Join policymakers, investors, agribusiness leaders, and service
                providers shaping Nigeria&apos;s mechanization future.
              </p>
              <div className="mt-8">
                <Link
                  href="/"
                  className="inline-flex rounded-lg border border-white/50 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm"
                >
                  Back to homepage
                </Link>
              </div>
            </motion.div>

            <motion.section
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: "easeOut", delay: 0.08 }}
              className="rounded-2xl border border-white/20 bg-white/95 p-6 shadow-2xl backdrop-blur md:p-8"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent-orange)]">
                Registration Update
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-gray-900">
                Registration is closed
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Registration is closed for TMF 2026. Please follow our official
                channels for waitlist or next event updates.
              </p>
              <div className="mt-6 rounded-xl border border-[#ffd9bf] bg-[#fff8f2] px-4 py-4 text-sm text-[#8b4d24]">
                Thank you for your interest. This registration portal is no longer
                accepting submissions for TMF 2026.
              </div>
            </motion.section>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
