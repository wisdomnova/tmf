"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const footerGroups = [
  {
    title: "Explore",
    links: [
      { label: "Home", href: "/" },
      { label: "About TMF", href: "/about" },
      { label: "Partners", href: "/partners" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "Events",
    links: [
      { label: "TMF 2025", href: "/events/tmf-2025" },
      { label: "Policy Event", href: "/events/policy-ratification-dialogue" },
      { label: "TMF '26", href: "/events/tmf-26" },
    ],
  },
];

export default function SiteFooter() {
  return (
    <motion.footer
      className="my-12 flex w-full justify-center"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="w-[98vw] rounded-3xl bg-[#121212] px-6 py-10 text-white md:px-10">
        <div className="mx-auto w-full max-w-7xl">
          <motion.div
            className="grid gap-10 border-b border-white/15 pb-10 md:grid-cols-12"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            <motion.div
              className="md:col-span-5"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.45 }}
              transition={{ duration: 0.45, ease: "easeOut", delay: 0.05 }}
            >
              <Image
                src="/tmf/TMF-1.png"
                alt="TMF Nigeria logo"
                width={190}
                height={56}
                className="h-11 w-auto"
              />
              <p className="mt-4 text-xs uppercase tracking-[0.16em] text-white/65">
                TMF Nigeria
              </p>
              <p className="mt-2 max-w-sm text-xl font-semibold leading-snug">
                The Mechanization Forum
              </p>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-white/70">
                Nigeria&apos;s stakeholder platform for policy, investment, and
                innovation in agricultural mechanization.
              </p>
            </motion.div>

            <motion.div
              className="grid gap-8 sm:grid-cols-2 md:col-span-7"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.45 }}
              transition={{ duration: 0.45, ease: "easeOut", delay: 0.1 }}
            >
              {footerGroups.map((group) => (
                <nav key={group.title}>
                  <p className="text-xs uppercase tracking-[0.14em] text-white/55">
                    {group.title}
                  </p>
                  <ul className="mt-4 space-y-3">
                    {group.links.map((link) => (
                      <li key={link.label}>
                        <Link href={link.href} className="text-sm text-white/90">
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            className="flex flex-col gap-3 pt-6 text-xs text-white/55 md:flex-row md:items-center md:justify-between"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.12 }}
          >
            <p>© 2026 TracTrac Mechanisation Services Limited</p>
            <p>tmfnigeria.com</p>
          </motion.div>
        </div>
      </div>
    </motion.footer>
  );
}
