"use client";

import { motion } from "framer-motion";

type TimelineItem = {
  period: string;
  month: string;
  dayRange: string;
  location: string;
  badge?: string;
  title: string;
  body: string;
};

const timelineItems: TimelineItem[] = [
  {
    period: "September 2025",
    month: "Sep",
    dayRange: "2025",
    location: "Abuja",
    title: "TMF 2025 - The State of Agricultural Mechanization Ecosystem in Nigeria",
    body: "TMF's inaugural edition brought together government, NCAM, private investors, development partners, and media to assess Nigeria's mechanization landscape and demand coordinated policy action. The forum revealed a critical investor information gap and set the agenda for NAMP 2025.",
  },
  {
    period: "12-14 May 2026",
    month: "May",
    dayRange: "12-14",
    location: "Abuja Continental Hotel",
    badge: "May 2026",
    title: "Special Event - Mechanisation Policy Ratification Dialogue (NAMP 2025)",
    body: "A high level, 3 day multi stakeholder forum to review, pre ratify, and ratify Nigeria's National Agricultural Mechanisation Policy. Hosted by FMAFS and TracTrac MSL, targeting 500 participants including the Vice President, Minister of Agriculture, and 100 exhibitors.",
  },
  {
    period: "Late 2026",
    month: "Late",
    dayRange: "2026",
    location: "Abuja",
    badge: "Registering",
    title: "TMF '26 - The Mechanization Forum (Second Edition)",
    body: "Building on the policy momentum of the Ratification Dialogue, TMF '26 will convene a broader, bolder audience to convert policy into investment commitments and a national mechanization compact. Early partner and speaker registrations are now open.",
  },
];

export default function EventsTimelineSection() {
  return (
    <motion.section
      className="bg-white py-24"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="mx-auto w-full max-w-7xl px-6">
        <motion.p
          className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent-orange)]"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          Our Journey
        </motion.p>
        <motion.h2
          className="mt-4 max-w-4xl text-3xl font-semibold leading-tight text-gray-900 md:text-5xl"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.05 }}
        >
          From conversation to policy - and beyond
        </motion.h2>
        <motion.p
          className="mt-6 max-w-3xl text-base leading-relaxed text-gray-700 md:text-lg"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
        >
          TMF is not a one time conference. It is a growing movement, with each
          event building accountability and momentum toward a mechanized Nigeria.
        </motion.p>

        <div className="mt-14 grid gap-8 lg:grid-cols-3">
          {timelineItems.map((item, index) => (
            <motion.article
              key={item.title}
              className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.45, ease: "easeOut", delay: index * 0.08 }}
            >
              <div className="bg-[#e12900] px-6 py-4 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.12em]">
                  {item.month}
                </p>
                <p className="mt-1 text-3xl font-semibold leading-none">{item.dayRange}</p>
              </div>

              <div className="border-b border-gray-200 bg-[#fafafa] px-6 py-4">
                <p className="text-sm font-semibold text-gray-900">{item.period}</p>
                <p className="mt-1 text-sm text-gray-600">{item.location}</p>
                {item.badge ? (
                  <span className="mt-3 inline-flex rounded-full border border-gray-300 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-700">
                    {item.badge}
                  </span>
                ) : null}
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold leading-snug text-gray-900">
                  {item.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-gray-700">
                  {item.body}
                </p>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          className="mt-14"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.45 }}
          transition={{ duration: 0.45, ease: "easeOut", delay: 0.12 }}
        >
          <a
            href="/register"
            className="inline-flex rounded-lg px-6 py-3 text-sm font-semibold text-white"
            style={{
              background: "linear-gradient(182deg, #E12900 0%, #FA9411 100%)",
            }}
          >
            Register for TMF &apos;26
          </a>
        </motion.div>
      </div>
    </motion.section>
  );
}
