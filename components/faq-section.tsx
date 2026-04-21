"use client";

import { AnimatePresence, motion } from "framer-motion";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import { useState } from "react";

type FAQItem = {
  question: string;
  answer: string;
};

type FAQGroup = {
  title: string;
  items: FAQItem[];
};

const faqGroups: FAQGroup[] = [
  {
    title: "General - About TMF",
    items: [
      {
        question: "What is TMF?",
        answer:
          "The Mechanization Forum (TMF) is a multi-stakeholder convening platform organized by TracTrac Mechanisation Services Limited (MSL). It brings together government, investors, development partners, agri-businesses, and mechanization service providers to address Nigeria's agricultural mechanization crisis and drive coordinated policy and investment action.",
      },
      {
        question: "Who organizes TMF?",
        answer:
          "TMF is organized by TracTrac Mechanisation Services Limited, headquartered in Abuja, Nigeria. The Policy Ratification Dialogue is co-organized with the Federal Ministry of Agriculture and Food Security (FMAFS).",
      },
      {
        question: "How often does TMF happen?",
        answer:
          "TMF is an annual convening. TMF 2025 was the inaugural edition. The Special Policy Event (May 2026) is a dedicated policy track, and TMF '26 is the second full edition of the forum.",
      },
    ],
  },
  {
    title: "Policy Ratification Dialogue - May 2026",
    items: [
      {
        question: "Who should attend the Policy Ratification Dialogue?",
        answer:
          "FMAFS and NCAM directors, State Agriculture Commissioners, private mechanization firms, CBN and NAIC representatives, equipment manufacturers (OEMs), farmer cooperatives, development partners, civil society organizations, and academia. Priority invitees receive subsidized accommodation and travel support.",
      },
      {
        question: "Is there virtual access to the event?",
        answer:
          "Yes. A free live stream will be provided for plenary sessions where appropriate. Recordings will be made available to registered participants after the event.",
      },
      {
        question: "Is this the final policy or a draft?",
        answer:
          "The Dialogue reviews and ratifies the draft NAMP 2025. Final post-workshop refinements will be incorporated before submission to the National Assembly for legislative processing.",
      },
      {
        question: "What happens after the event?",
        answer:
          "The refined policy will be formally submitted to FMAFS for transmission through the Federal Executive Council to the National Assembly. The Secretariat will track implementation. A formal proceedings report will be released within two weeks of the event.",
      },
      {
        question: "How do I register?",
        answer:
          "Registration is available at tmfnigeria.com, categorized by participant type. Automated confirmation and accreditation details will be sent upon registration.",
      },
    ],
  },
  {
    title: "TMF '26",
    items: [
      {
        question: "When and where is TMF '26?",
        answer:
          "TMF '26 will be held in Abuja in late 2026. The exact date and venue will be confirmed after the Policy Ratification Dialogue in May 2026. Early registrants will be notified as soon as details are finalized.",
      },
      {
        question: "Can I speak or exhibit at TMF '26?",
        answer:
          "Yes. Speaker applications and exhibition space reservations can be submitted at tmfnigeria.com. Priority will be given to early applicants and confirmed partners.",
      },
    ],
  },
];

export default function FAQSection() {
  const [openKey, setOpenKey] = useState<string | null>(null);

  return (
    <motion.section
      id="faq"
      className="scroll-mt-24 bg-white py-24"
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
          FAQ
        </motion.p>
        <motion.h2
          className="mt-4 text-3xl font-semibold leading-tight text-gray-900 md:text-5xl"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.05 }}
        >
          Frequently asked questions
        </motion.h2>

        <div className="mt-12 space-y-10">
          {faqGroups.map((group, groupIndex) => (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.45, ease: "easeOut", delay: groupIndex * 0.06 }}
            >
              <h3 className="inline-flex items-center rounded-full border-2 border-[var(--accent-orange)] bg-white px-5 py-2 text-sm font-extrabold uppercase tracking-[0.12em] text-[var(--accent-orange)] md:text-base">
                {group.title}
              </h3>
              <div className="mt-4 space-y-3">
                {group.items.map((item) => {
                  const key = `${group.title}-${item.question}`;
                  const isOpen = openKey === key;

                  return (
                    <motion.div
                      key={item.question}
                      className="rounded-xl border border-gray-200 bg-[#f8f8f8]"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.4 }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                    >
                      <button
                        type="button"
                        onClick={() => setOpenKey(isOpen ? null : key)}
                        className="flex w-full items-center justify-between gap-4 p-5 text-left"
                      >
                        <span className="text-base font-semibold text-gray-900">
                          {item.question}
                        </span>
                        <span className="shrink-0 text-[var(--accent-orange)]">
                          {isOpen ? (
                            <IconChevronUp size={20} />
                          ) : (
                            <IconChevronDown size={20} />
                          )}
                        </span>
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen ? (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.22, ease: "easeOut" }}
                            className="overflow-hidden"
                          >
                            <p className="px-5 pb-5 text-sm leading-relaxed text-gray-700 md:text-base">
                              {item.answer}
                            </p>
                          </motion.div>
                        ) : null}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
