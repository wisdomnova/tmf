"use client";

import { motion } from "framer-motion";
import SiteHeader from "../../../components/site-header";
import SiteFooter from "../../../components/site-footer";

const objectives = [
  "Ratify the draft National Mechanization Policy through structured multi-stakeholder deliberations",
  "Incorporate stakeholder input to improve clarity, acceptability, feasibility, and implementation pathways",
  "Align Federal and State actors on strategic priorities for mechanization across Nigeria",
  "Strengthen public-private collaboration in mechanization service delivery",
  "Generate a consolidated validation report to guide policy finalization before legislative submission",
];

const agendaRows = [
  {
    time: "8:00-9:00",
    day1: "Registration and networking breakfast",
    day2: "Breakfast and exhibits",
    day3: "Breakfast",
  },
  {
    time: "9:00-11:00",
    day1: "Opening keynote by FMAFS Perm Sec; TracTrac MSL MD on ISSAM and NAMP synergies",
    day2: "Breakouts: Sections 1-5 (Land, Technology, Training), TracTrac-led",
    day3: "Plenary: Validation synthesis",
  },
  {
    time: "11:00-11:30",
    day1: "Guided tour by the Hon. Minister of Agriculture (FMAFS, TracTrac, NCAM)",
    day2: "Tea and live demos",
    day3: "Tea break",
  },
  {
    time: "11:30-13:30",
    day1: "Draft policy presentation: The journey thus far by Director Mechanization",
    day2: "Breakouts: Policy sections continued",
    day3: "Recommendations adoption and MoU signing",
  },
  {
    time: "13:30-14:30",
    day1: "Lunch by TracTrac MSL and NCAM",
    day2: "Lunch and live tractor demonstrations",
    day3: "Lunch",
  },
  {
    time: "14:30-16:30",
    day1: "Panel: Sections 11-15 (Extension, Insurance, Finance)",
    day2: "Breakouts: Technical sections continued",
    day3: "Action plan launch and communique release",
  },
  {
    time: "16:30-17:00",
    day1: "Closing and networking",
    day2: "Exhibitions close and networking",
    day3: "Official closing ceremony",
  },
];

const tracks = [
  {
    title: "Finance Track",
    body: "Development financing instruments, tractor investment models, CBN and NAIC engagement strategies.",
  },
  {
    title: "Technology Track",
    body: "Digital platforms, precision agriculture tools, and agri-tech innovation in mechanization.",
  },
  {
    title: "Implementation Track",
    body: "State-level tractor deployment, MSP capacity building, and extension service delivery.",
  },
  {
    title: "Inclusion Track",
    body: "Women, youth, and persons with disabilities in the mechanization value chain.",
  },
];

const dignitaries = [
  "The Vice President, Federal Republic of Nigeria",
  "Honorable Minister of Agriculture and Food Security",
  "Honorable Minister of State for Agriculture",
  "Chairman, Senate Committee on Agriculture",
  "Chairman, House Committee on Agricultural Production",
  "Hon. Commissioners of Agriculture (All States)",
  "Representatives from Departments of Agricultural Engineering in universities and polytechnics",
  "NCAM, CBN, NAIC, OEMs, and farmer cooperatives",
];

const sponsorshipRows = [
  {
    tier: "Platinum",
    investment: "N20,000,000",
    includes:
      "Main stage branding, exhibition booth, participant kits, media coverage, VIP access, speaking slot",
  },
  {
    tier: "Gold",
    investment: "N10,000,000",
    includes:
      "Exhibition booth, participant kits, media coverage, co-branding on all materials",
  },
  {
    tier: "Additional Tiers",
    investment: "Available on request",
    includes:
      "Custom packages for specific programme elements, contact the secretariat for full prospectus",
  },
];

export default function PolicyRatificationDialoguePage() {
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
              Special Policy Event · 12-14 May 2026
            </p>
            <h1 className="mt-6 max-w-5xl text-4xl font-semibold leading-tight md:text-6xl">
              Mechanization Policy Ratification Dialogue: Shaping the future of
              Nigeria&apos;s agricultural mechanization
            </h1>
            <p className="mt-6 max-w-4xl text-base leading-relaxed text-white/80 md:text-lg">
              A landmark 3-day multi-stakeholder forum to review, pre-ratify, and
              ratify Nigeria&apos;s National Agricultural Mechanization Policy (NAMP
              2025) before submission to the National Assembly for legislative
              consideration.
            </p>
            <p className="mt-6 text-sm font-medium text-white/80">
              12-14 May 2026 · Ladi Kwali Hall, Abuja Continental Hotel, Abuja · 500
              participants · 100 exhibitors
            </p>
            <div className="mt-6 grid gap-4 text-sm md:grid-cols-2">
              <div className="rounded-lg border border-white/20 bg-white/10 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.12em] text-white/70">
                  Convened by
                </p>
                <p className="mt-1 font-semibold">
                  Federal Ministry of Agriculture and Food Security
                </p>
              </div>
              <div className="rounded-lg border border-white/20 bg-white/10 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.12em] text-white/70">
                  Principal Partner
                </p>
                <p className="mt-1 font-semibold">
                  TracTrac Mechanization Services Limited (MSL)
                </p>
              </div>
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
              Background and Context
            </p>
            <div className="mt-6 grid gap-5 lg:grid-cols-12">
              <div className="border-2 border-gray-200 p-[6px] lg:col-span-8">
                <div className="h-full bg-[#f7f7f7] px-6 py-8 md:px-8">
                  <p className="text-base leading-relaxed text-gray-700 md:text-lg">
                    The Federal Government of Nigeria, through the Federal Ministry of
                    Agriculture and Food Security, is advancing the National
                    Agricultural Mechanization Policy (NAMP 2025) to strengthen
                    productivity, inclusivity, and sustainability in agriculture.
                  </p>
                  <p className="mt-5 text-base leading-relaxed text-gray-700 md:text-lg">
                    TracTrac Mechanization Services Limited serves as Principal
                    Partner, with proven expertise in smallholder mechanized access,
                    capacity building, and data-driven support systems developed in
                    collaboration with government institutions.
                  </p>
                  <p className="mt-5 text-base leading-relaxed text-gray-700 md:text-lg">
                    This alignment requires broad stakeholder pre-ratification and
                    ratification of the draft policy to ensure technical robustness,
                    political acceptability, and practical applicability before
                    legislative submission.
                  </p>
                </div>
              </div>
              <div className="border border-gray-200 p-[6px] lg:col-span-4">
                <div className="h-full bg-[#151515] px-6 py-8 text-white">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#FA9411]">
                    Event Objectives
                  </p>
                  <ul className="mt-4 space-y-3 text-sm text-white/85">
                    {objectives.map((item) => (
                      <li key={item}>• {item}</li>
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
              Two-Phase Structure
            </p>
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <div className="rounded-2xl border-2 border-gray-200 p-[6px]">
                <div className="h-full rounded-xl bg-white p-6">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Phase 1: Pre-Ratification Event
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-gray-700">
                    Strategic review and pre-ratification of NAMP 2025 prior to the
                    May national workshop. A 3-day high-level forum for 30 VIP
                    stakeholders across the mechanization ecosystem.
                  </p>
                  <p className="mt-4 text-sm font-semibold text-gray-900">
                    Outcome: Refined policy recommendations ensuring stakeholder
                    alignment.
                  </p>
                </div>
              </div>
              <div className="rounded-2xl border border-gray-200 p-[6px]">
                <div className="h-full rounded-xl bg-[#151515] p-6 text-white">
                  <h3 className="text-xl font-semibold">Phase 2: Ratification Event</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/80">
                    Full multi-stakeholder ratification of the final draft National
                    Policy on Mechanisation with 500 participants from across the
                    ecosystem.
                  </p>
                  <p className="mt-4 text-sm font-semibold text-white">
                    Outcome: Ratified policy document ready for National Assembly
                    submission.
                  </p>
                </div>
              </div>
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
              3-Day Agenda
            </p>
            <div className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white">
              <div className="grid gap-0 bg-[#151515] text-xs font-semibold uppercase tracking-[0.1em] text-white md:grid-cols-[120px_1fr_1fr_1fr]">
                <p className="px-4 py-3">Time</p>
                <p className="px-4 py-3">Day 1: May 12</p>
                <p className="px-4 py-3">Day 2: May 13</p>
                <p className="px-4 py-3">Day 3: May 14</p>
              </div>
              {agendaRows.map((row) => (
                <div
                  key={row.time}
                  className="grid border-t border-gray-200 text-sm md:grid-cols-[120px_1fr_1fr_1fr]"
                >
                  <p className="px-4 py-4 font-semibold text-gray-900">{row.time}</p>
                  <p className="px-4 py-4 text-gray-700">{row.day1}</p>
                  <p className="px-4 py-4 text-gray-700">{row.day2}</p>
                  <p className="px-4 py-4 text-gray-700">{row.day3}</p>
                </div>
              ))}
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
              Breakout Session Tracks
            </p>
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {tracks.map((track) => (
                <div key={track.title} className="rounded-2xl border border-gray-200 p-[6px]">
                  <div className="h-full rounded-xl bg-white p-6">
                    <h3 className="text-lg font-semibold text-gray-900">{track.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-gray-700">{track.body}</p>
                  </div>
                </div>
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
              <div className="rounded-2xl border-2 border-gray-200 p-[6px] lg:col-span-7">
                <div className="h-full rounded-xl bg-[#151515] p-6 text-white md:p-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#FA9411]">
                    Special Guests and Dignitaries
                  </p>
                  <ul className="mt-5 space-y-3 text-sm text-white/85 md:text-base">
                    {dignitaries.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="rounded-2xl border border-gray-200 p-[6px] lg:col-span-5">
                <div className="h-full rounded-xl bg-[#f7f7f7] p-6 md:p-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent-orange)]">
                    Sponsorship Tiers
                  </p>
                  <div className="mt-4 space-y-3">
                    {sponsorshipRows.map((row) => (
                      <div key={row.tier} className="rounded-lg border border-gray-200 bg-white p-3">
                        <p className="text-sm font-semibold text-gray-900">
                          {row.tier} · {row.investment}
                        </p>
                        <p className="mt-2 text-sm text-gray-700">{row.includes}</p>
                      </div>
                    ))}
                  </div>
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
            <div className="rounded-2xl border border-gray-200 bg-white px-6 py-8 md:px-10">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent-orange)]">
                Logistics and Venue
              </p>
              <p className="mt-4 text-base text-gray-700 md:text-lg">
                <span className="font-semibold text-gray-900">Venue:</span> Ladi Kwali
                Hall, Abuja Continental Hotel, Abuja
              </p>
              <p className="mt-2 text-base text-gray-700 md:text-lg">
                <span className="font-semibold text-gray-900">Dates:</span> 12-14 May
                2026 (subject to early confirmation by the committee)
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href="/register"
                  className="rounded-lg px-5 py-3 text-sm font-semibold text-white"
                  style={{
                    background: "linear-gradient(182deg, #E12900 0%, #FA9411 100%)",
                  }}
                >
                  Register to Attend
                </a>
                <a
                  href="mailto:partnerships@tmfnigeria.com?subject=Policy%20Event%20Sponsorship"
                  className="rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-800"
                >
                  Enquire About Sponsorship
                </a>
              </div>
            </div>
          </div>
        </motion.section>
      </main>
      <SiteFooter />
    </div>
  );
}
