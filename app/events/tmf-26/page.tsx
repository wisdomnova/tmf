"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import SiteHeader from "../../../components/site-header";
import SiteFooter from "../../../components/site-footer";

const audienceCards = [
  {
    title: "Investors",
    body: "Access curated mechanization investment briefs, meet vetted MSPs, and explore tractor financing instruments with on-the-ground operators.",
  },
  {
    title: "Mechanization Service Providers",
    body: "Showcase your MSP business, access training pathways, connect with equipment financing options, and build cooperative networks with peers.",
  },
  {
    title: "Government",
    body: "Engage private sector and development partners on implementation of the newly ratified NAMP and regulatory alignment across all 36 states.",
  },
  {
    title: "OEMs and Agribusiness",
    body: "Exhibit your equipment, enter the Nigerian mechanization market, and engage with procurement channels and investor networks directly.",
  },
  {
    title: "Development Partners",
    body: "Connect with proven implementers, co-design interventions, and channel funding into the mechanization value chain with accountability frameworks.",
  },
  {
    title: "Media and Academia",
    body: "Access accredited media coverage, research partnership platforms, and policy commentary opportunities at Nigeria's leading mechanization event.",
  },
];

const themes = [
  "From policy to practice: Implementing NAMP 2025 at state level",
  "Mobilizing N50 billion for mechanization: Investment frameworks and DFI engagement",
  "The MSP economy: Building sustainable mechanization enterprises across Nigeria",
  "Local assembly and AfCFTA: Growing Nigeria's tractor manufacturing capacity",
  "Women in mechanization: Scaling the 50 percent MSP target across all states",
  "Data and intelligence: Building Nigeria's first mechanization data ecosystem",
  "Youth and jobs: Mechanization as Nigeria's next large-scale employment sector",
];

const outputs = [
  "A National Mechanization Investment Compact signed by private sector, government, and development partners",
  "Committed investments mapped to specific states and mechanization corridors",
  "An updated Nigeria Mechanization State of Play report for 2026",
  "A new cohort of recognized MSP champions from across Nigeria",
  "Expanded media coverage and a digital content archive from all sessions",
];

export default function TMF26EventPage() {
  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />

      <main>
        <motion.section
          className="bg-[#151515] py-20 text-white md:py-24"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          <div className="mx-auto w-full max-w-6xl px-6">
            <p className="inline-flex rounded-full border border-white/30 px-4 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white/85">
              TMF '26 · The Mechanization Forum · Second Edition · 2026
            </p>
            <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-tight md:text-6xl">
              The biggest mechanization conversation Nigeria has ever had.
            </h1>
            <p className="mt-6 max-w-4xl text-base leading-relaxed text-white/80 md:text-lg">
              TMF '26 is the second full edition of The Mechanization Forum. Where
              TMF 2025 diagnosed the ecosystem and the Policy Ratification Dialogue
              writes the framework, TMF '26 delivers the action: investment
              commitments, regional expansion, and Nigeria's mechanization compact.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/register"
                className="rounded-lg px-5 py-3 text-sm font-semibold text-white"
                style={{
                  background: "linear-gradient(182deg, #E12900 0%, #FA9411 100%)",
                }}
              >
                Register Early Interest
              </Link>
              <a
                href="mailto:partnerships@tmfnigeria.com"
                className="rounded-lg border border-white/50 bg-white/10 px-5 py-3 text-sm font-semibold text-white"
              >
                Become a TMF '26 Partner
              </a>
            </div>
            <p className="mt-6 max-w-3xl text-sm text-white/75">
              Exact date and venue will be confirmed following the Policy
              Ratification Dialogue. Early registrants will be notified first.
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
              Event Overview
            </p>
            <div className="mt-6 grid gap-5 lg:grid-cols-12">
              <div className="border-2 border-gray-200 p-[6px] lg:col-span-8">
                <div className="h-full bg-[#f7f7f7] px-6 py-8 md:px-8">
                  <p className="text-base leading-relaxed text-gray-700 md:text-lg">
                    Building on two years of ground-level work and the policy progress
                    of the Ratification Dialogue, TMF '26 will convene a larger and
                    bolder audience, scaling the conversation from diagnosis and policy
                    to investment commitments and a shared national mechanization
                    roadmap.
                  </p>
                  <p className="mt-5 text-base leading-relaxed text-gray-700 md:text-lg">
                    This is where the communique becomes a compact. Where draft policy
                    becomes implementation. Where mechanization stakeholders stop
                    talking about the gap and start closing it.
                  </p>
                </div>
              </div>
              <div className="border border-gray-200 p-[6px] lg:col-span-4">
                <div className="h-full bg-[#151515] px-6 py-8 text-white">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#FA9411]">
                    Status
                  </p>
                  <p className="mt-3 text-2xl font-semibold">Registrations opening</p>
                  <p className="mt-3 text-sm leading-relaxed text-white/75">
                    Early interest and partner applications are currently open for
                    qualified participants and institutions.
                  </p>
                </div>
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
              Who Should Attend
            </p>
            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {audienceCards.map((card, index) => (
                <motion.article
                  key={card.title}
                  className={`p-[6px] ${index < 2 ? "border-2 border-gray-200" : "border border-gray-200"}`}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.4, ease: "easeOut", delay: index * 0.05 }}
                >
                  <div className="h-full bg-white p-5">
                    <h3 className="text-lg font-semibold text-gray-900">{card.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-gray-700">{card.body}</p>
                  </div>
                </motion.article>
              ))}
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
            <div className="grid gap-5 lg:grid-cols-12">
              <div className="border border-gray-200 p-[6px] lg:col-span-7">
                <div className="h-full bg-[#141414] px-6 py-8 text-white md:px-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#FA9411]">
                    Key Themes
                  </p>
                  <ul className="mt-5 space-y-3">
                    {themes.map((item) => (
                      <li key={item} className="text-sm leading-relaxed text-white/85 md:text-base">
                        • {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="border-2 border-gray-200 p-[6px] lg:col-span-5">
                <div className="h-full bg-[#f7f7f7] px-6 py-8 md:px-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent-orange)]">
                    TMF '26 Outputs
                  </p>
                  <ul className="mt-5 space-y-3">
                    {outputs.map((item) => (
                      <li key={item} className="text-sm leading-relaxed text-gray-700 md:text-base">
                        • {item}
                      </li>
                    ))}
                  </ul>
                </div>
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
              TMF '26 Participation
            </p>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {[
                "Register Early Interest",
                "Become a TMF '26 Partner",
                "Apply to Speak",
                "Exhibit at TMF '26",
              ].map((item, index) => (
                <motion.div
                  key={item}
                  className={`p-[6px] ${index === 0 ? "border-2 border-gray-200" : "border border-gray-200"}`}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.35, ease: "easeOut", delay: index * 0.05 }}
                >
                  <div className="bg-white px-5 py-5">
                    <p className="text-base font-semibold text-gray-900">{item}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="mt-10 border border-gray-200 bg-white px-6 py-8 text-center">
              <p className="text-base leading-relaxed text-gray-700 md:text-lg">
                TMF '26 early registrations are now open. The mechanization movement
                is growing. Be inside it.
              </p>
              <Link
                href="/register"
                className="mt-5 inline-flex rounded-lg px-6 py-3 text-sm font-semibold text-white"
                style={{
                  background: "linear-gradient(182deg, #E12900 0%, #FA9411 100%)",
                }}
              >
                Register Early Interest
              </Link>
            </div>
          </div>
        </motion.section>
      </main>

      <SiteFooter />
    </div>
  );
}
