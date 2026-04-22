"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  IconChartBar,
  IconChecklist,
  IconUsersGroup,
  IconAccessible,
} from "@tabler/icons-react";
import SiteHeader from "../../components/site-header";
import SiteFooter from "../../components/site-footer";

const differentiators = [
  {
    title: "Evidence-driven",
    body: "Every TMF agenda item is anchored in mechanization data, from tractor density statistics to yield impact figures and investment gap analysis.",
    icon: IconChartBar,
  },
  {
    title: "Action-oriented",
    body: "TMF events close with communiques, MoU signings, and implementation roadmaps. Accountability is built into the format.",
    icon: IconChecklist,
  },
  {
    title: "Multi-stakeholder",
    body: "Government, investors, development partners, MSPs, farmers, OEMs, and academia sit at one table instead of parallel silos.",
    icon: IconUsersGroup,
  },
  {
    title: "Inclusive by design",
    body: "TMF includes dedicated tracks for gender equity, youth employment, and persons with disabilities.",
    icon: IconAccessible,
  },
];

const tractracHighlights = [
  "135,000+ smallholder farmers reached",
  "804 tractors deployed across three states",
  "3,900+ mechanisation service providers active on platform",
  "ISSAM project implemented in partnership with the Mastercard Foundation",
  "Training 6,000+ young Nigerians, with focus on women and persons with disabilities",
  "Technology platforms: TracTrac Plus and TracTrac Agent",
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <main>
        <motion.section
          className="bg-[#141414] py-20 text-white md:py-24"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="mx-auto w-full max-w-6xl px-6">
            <p className="inline-flex rounded-full border border-white/35 px-4 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white/80">
              About The Mechanization Forum
            </p>
            <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight md:text-6xl">
              Built on one conviction: mechanization is the fastest lever for
              Nigeria&apos;s food security
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-relaxed text-white/80 md:text-lg">
              TMF is TracTrac MSL&apos;s contribution to the broader policy and
              investment ecosystem because technology alone cannot change agriculture.
              Systems must change too.
            </p>
          </div>
        </motion.section>

        <motion.section
          className="bg-white py-20"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          <div className="mx-auto w-full max-w-6xl px-6">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent-orange)]">
              Our Story
            </p>
            <div className="mt-6 grid gap-5 md:grid-cols-12">
              <div className="border-2 border-gray-200 p-[6px] md:col-span-7">
                <div className="h-full bg-[#f7f7f7] px-6 py-8 md:px-8">
                  <p className="text-base leading-relaxed text-gray-700 md:text-lg">
                    TMF was born from a hard reality. Nigeria had no dedicated
                    convening platform where every stakeholder in the mechanization
                    ecosystem could speak in one room. Government agencies issued
                    policies without private-sector input. Investors lacked credible
                    data. MSPs were being trained without a voice in policy decisions
                    that governed their work.
                  </p>
                  <p className="mt-5 text-base leading-relaxed text-gray-700 md:text-lg">
                    In September 2025, TracTrac MSL organized the first
                    Mechanization Forum in Abuja. What began as The State of
                    Agricultural Mechanization Ecosystem in Nigeria became a coalition
                    of voices demanding change, backed by data, and committed to
                    accountability.
                  </p>
                  <p className="mt-5 text-base font-semibold leading-relaxed text-gray-900 md:text-lg">
                    That coalition is TMF. And it is just getting started.
                  </p>
                </div>
              </div>
              <div className="border-2 border-gray-200 p-[6px] md:col-span-5">
                <div className="h-full bg-[#151515] px-6 py-8 text-white md:px-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#FA9411]">
                    Why this matters
                  </p>
                  <p className="mt-4 text-2xl font-semibold leading-snug">
                    Policy and implementation have to meet in the same room.
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-white/75">
                    TMF exists to convert fragmented conversations into coordinated
                    execution.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 border-2 border-gray-200 p-[6px]">
              <div className="bg-[#f4f4f4] px-8 py-10 md:px-12">
                <p className="text-base italic leading-relaxed text-gray-800 md:text-lg">
                  &quot;Without supportive policy, innovations and investments risk not
                  reaching their full potential. We must engage in robust discussions
                  on how policy can create an enabling environment for sustainable
                  mechanisation.&quot;
                </p>
                <p className="mt-4 text-base font-bold text-[#e12900] md:text-lg">
                  Godson Ohuruogu, CEO, TracTrac MSL
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section
          className="bg-[#f7f7f7] py-20"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          <div className="mx-auto w-full max-w-6xl px-6">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent-orange)]">
              What Makes TMF Different
            </p>
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {differentiators.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.article
                    key={item.title}
                  className="rounded-2xl border-2 border-gray-200 p-[6px]"
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.45, ease: "easeOut", delay: index * 0.06 }}
                  >
                    <div className="h-full rounded-xl bg-white p-6 md:p-7">
                      <div className="inline-flex rounded-md border border-[#ffdfc7] bg-[#fff7ef] p-2 text-[#e12900]">
                        <Icon size={20} />
                      </div>
                      <h3 className="mt-4 text-xl font-semibold text-gray-900">
                        {item.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-gray-700 md:text-base">
                        {item.body}
                      </p>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </motion.section>

        <motion.section
          className="bg-white py-20"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          <div className="mx-auto w-full max-w-6xl px-6">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent-orange)]">
              About TracTrac MSL
            </p>
            <div className="mt-6 grid gap-5 lg:grid-cols-12">
              <div className="border-2 border-gray-200 p-[6px] lg:col-span-7">
                <div className="h-full bg-[#141414] px-6 py-8 text-white md:px-8">
                  <h2 className="text-3xl font-semibold leading-tight md:text-4xl">
                    TMF is an initiative of TracTrac Mechanisation Services Limited
                  </h2>
                  <p className="mt-4 text-base leading-relaxed text-white/80 md:text-lg">
                    Nigeria&apos;s leading agricultural mechanization technology company.
                  </p>
                  <Link
                    href="https://tractrac.co"
                    target="_blank"
                    rel="noreferrer"
                    className="mt-7 inline-flex rounded-lg border border-white/35 bg-white/10 px-5 py-3 text-sm font-semibold text-white"
                  >
                    Visit tractrac.co
                  </Link>
                </div>
              </div>
              <div className="border-2 border-gray-200 p-[6px] lg:col-span-5">
                <div className="h-full bg-[#f7f7f7] px-6 py-8 md:px-8">
                  <ul className="space-y-3">
                    {tractracHighlights.map((item) => (
                      <li key={item} className="rounded-lg border border-gray-200 bg-white p-3 text-sm text-gray-700 md:text-base">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      </main>
      <SiteFooter />
    </div>
  );
}
