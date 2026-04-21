"use client";

import {
  IconChartBarPopular,
  IconClockHour4,
  IconMoodDollar,
  IconTractor,
} from "@tabler/icons-react";
import { motion } from "framer-motion";

const crisisCards = [
  {
    title: "Only 16% access",
    body: "Of Nigeria's 34 million smallholder farmers, only 16% have access to mechanized equipment, hindered by cost, financing gaps, and weak supply chains.",
    icon: IconChartBarPopular,
    tone: "dark",
  },
  {
    title: "1.5 million tractors needed",
    body: "Nigeria has roughly 5,000 functional tractors. It needs 1.5 million to achieve food security. The investment gap, and the opportunity, is enormous.",
    icon: IconTractor,
    tone: "dark",
  },
  {
    title: "80 days vs 1 day",
    body: "What 40 people do in 80 days, one tractor completes in a single day. Manual farming is costing Nigeria its planting and harvest windows every season.",
    icon: IconClockHour4,
    tone: "dark",
  },
  {
    title: "63% in poverty",
    body: "133 million Nigerians live in multidimensional poverty, most in rural communities dependent on subsistence agriculture. Mechanization is their fastest path out.",
    icon: IconMoodDollar,
    tone: "dark",
  },
];

export default function CrisisSection() {
  const topCards = crisisCards.slice(0, 2);
  const bottomCards = crisisCards.slice(2, 4);

  function getCardStyles(tone: string) {
    if (tone === "dark") {
      return {
        wrapper: "bg-[#151515] text-white",
        icon: "bg-white text-[#151515]",
        title: "text-white",
        body: "text-white/80",
        outline: "outline-[#151515]/45",
        badge: "text-white/70 border-white/30",
      };
    }
    return {
      wrapper: "bg-[#f5f5f5] text-gray-900",
      icon: "bg-[#f9a411] text-white",
      title: "text-[#e12900]",
      body: "text-gray-700",
      outline: "outline-[#f9a411]/45",
      badge: "text-black border-black/25",
    };
  }

  return (
    <motion.section
      className="bg-[#f5f5f5] py-20"
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
          The crisis we&apos;re solving
        </motion.p>
        <motion.h2
          className="mt-4 max-w-4xl text-3xl font-semibold leading-tight text-gray-900 md:text-4xl"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.05 }}
        >
          Nigeria&apos;s mechanization gap is a food security emergency
        </motion.h2>

        <div className="mt-12 max-w-4xl">
          <div className="grid gap-y-4 md:grid-cols-2 md:gap-x-4">
            {topCards.map((card, index) => {
              const styles = getCardStyles(card.tone);
              return (
                <motion.article
                  key={card.title}
                  className={`w-full rounded-[2rem] border border-black/10 p-7 outline outline-1 outline-offset-4 md:p-8 ${styles.wrapper} ${styles.outline}`}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ duration: 0.45, ease: "easeOut", delay: index * 0.08 }}
                >
                  <div className="flex items-start justify-between">
                    <span
                      className={`inline-flex h-11 w-11 items-center justify-center rounded-full ${styles.icon}`}
                    >
                      <card.icon size={22} stroke={2} />
                    </span>
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                        styles.badge || "border-white/30 text-white/70"
                      }`}
                    >
                      TMF
                    </span>
                  </div>

                  <h3 className={`mt-7 text-3xl font-semibold leading-tight ${styles.title}`}>
                    {card.title}
                  </h3>
                  <p className={`mt-4 text-sm leading-relaxed md:text-base ${styles.body}`}>
                    {card.body}
                  </p>
                </motion.article>
              );
            })}
          </div>
        </div>

        <div className="mt-4 max-w-4xl md:ml-auto">
          <div className="grid gap-y-4 md:grid-cols-2 md:gap-x-4">
            {bottomCards.map((card, index) => {
            const styles = getCardStyles(card.tone);
            return (
              <motion.article
                key={card.title}
                className={`w-full rounded-[2rem] border border-black/10 p-7 outline outline-1 outline-offset-4 md:p-8 ${styles.wrapper} ${styles.outline}`}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.45, ease: "easeOut", delay: index * 0.08 }}
              >
                <div className="flex items-start justify-between">
                  <span
                    className={`inline-flex h-11 w-11 items-center justify-center rounded-full ${styles.icon}`}
                  >
                    <card.icon size={22} stroke={2} />
                  </span>
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                      styles.badge || "border-white/30 text-white/70"
                    }`}
                  >
                    TMF
                  </span>
                </div>

                <h3 className={`mt-7 text-3xl font-semibold leading-tight ${styles.title}`}>
                  {card.title}
                </h3>
                <p className={`mt-4 text-sm leading-relaxed md:text-base ${styles.body}`}>
                  {card.body}
                </p>
              </motion.article>
            );
            })}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
