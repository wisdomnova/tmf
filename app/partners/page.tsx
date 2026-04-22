"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import SiteHeader from "../../components/site-header";
import SiteFooter from "../../components/site-footer";

const partnershipTiers = [
  {
    tier: "Strategic Partner",
    includes:
      "Co-host events, shape the TMF agenda, and gain top-tier visibility across all channels and platforms.",
  },
  {
    tier: "Investment Partner",
    includes:
      "Deploy capital directly into the mechanization value chain with TracTrac's on-ground deployment infrastructure.",
  },
  {
    tier: "Knowledge Partner",
    includes:
      "Contribute research, data, and technical expertise to Nigeria's mechanization intelligence base.",
  },
  {
    tier: "Programme Partner",
    includes:
      "Co-fund MSP training, tractor deployment, and cooperative capacity building across states.",
  },
];

const partnerGains = [
  {
    title: "Policy access",
    body: "Participate in shaping mechanization policy through TMF stakeholder channels, including the NAMP 2025 Ratification Dialogue and TMF '26 sessions.",
  },
  {
    title: "Impact narrative",
    body: "Co-ownership of measurable outcomes such as tractors deployed, MSPs trained, and farmers reached for credible stakeholder reporting.",
  },
  {
    title: "Brand visibility",
    body: "Association with TMF across events, website presence, social media, press coverage, and participant communications.",
  },
  {
    title: "Networking access",
    body: "Priority access to networking sessions, ministerial roundtables, and closed-door investment briefings.",
  },
  {
    title: "Deal flow",
    body: "Direct introductions to vetted MSPs, equipment suppliers, investor networks, and procurement officers.",
  },
  {
    title: "Research and intelligence",
    body: "First access to TMF mechanization ecosystem reports, tractor density data, and market intelligence for investment decisions.",
  },
];

const ecosystemPartners = [
  { name: "Federal Ministry of Agriculture and Food Security", href: "https://fmard.gov.ng/" },
  { name: "National Centre for Agricultural Mechanisation", href: "https://ncamng.org/" },
  { name: "Mastercard Foundation", href: "https://mastercardfdn.org/" },
  { name: "Women in Mechanisation Association", href: "#" },
  { name: "Nigeria Economic Summit Group", href: "https://nesgroup.org/" },
  { name: "ETK Group", href: "#" },
  { name: "State Ministries of Agriculture - Nasarawa, Kaduna, FCT", href: "#" },
];

export default function PartnersPage() {
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
              Partner with TMF
            </p>
            <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-tight md:text-6xl">
              Nigeria&apos;s mechanization gap won&apos;t close without you.
            </h1>
            <p className="mt-6 max-w-4xl text-base leading-relaxed text-white/80 md:text-lg">
              TMF is not just a forum. It is a growing coalition. We are actively
              seeking organizations that share the conviction that mechanization is
              the fastest lever for food security, rural employment, and economic
              growth in Nigeria.
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
              The Case for Partnership
            </p>
            <div className="mt-6 grid gap-5 lg:grid-cols-12">
              <div className="border-2 border-gray-200 p-[6px] lg:col-span-8">
                <div className="h-full bg-[#f7f7f7] px-6 py-8 md:px-8">
                  <p className="text-base leading-relaxed text-gray-700 md:text-lg">
                    Nigeria needs 1.5 million tractors to achieve food security. It
                    currently has approximately 5,000 functional tractors. That gap is
                    one of the largest unmet agricultural infrastructure opportunities
                    on the African continent.
                  </p>
                  <p className="mt-5 text-base leading-relaxed text-gray-700 md:text-lg">
                    TMF partners gain direct access to the mechanization ecosystem:
                    government procurement decisions, investment deal flow, trained MSP
                    networks, policy advocacy channels, and visibility tied to
                    Nigeria&apos;s most credible mechanization movement.
                  </p>
                  <p className="mt-5 text-base leading-relaxed text-gray-700 md:text-lg">
                    Whether you are a development finance institution, government
                    agency, private investor, agribusiness, or research institution,
                    there is a meaningful and structured role for you here.
                  </p>
                </div>
              </div>
              <div className="border border-gray-200 p-[6px] lg:col-span-4">
                <div className="h-full bg-[#151515] px-6 py-8 text-white">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#FA9411]">
                    Opportunity Size
                  </p>
                  <p className="mt-3 text-3xl font-semibold">1.5 million</p>
                  <p className="text-sm text-white/70">Tractors required</p>
                  <p className="mt-5 text-3xl font-semibold">5,000</p>
                  <p className="text-sm text-white/70">Estimated functional tractors</p>
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
              Partnership Tiers
            </p>
            <div className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white">
              <div className="grid bg-[#151515] px-5 py-4 text-sm font-semibold text-white md:grid-cols-[220px_1fr]">
                <p>Partnership Tier</p>
                <p>What it includes</p>
              </div>
              {partnershipTiers.map((row) => (
                <div
                  key={row.tier}
                  className="grid border-t border-gray-200 px-5 py-4 md:grid-cols-[220px_1fr]"
                >
                  <p className="font-semibold text-gray-900">{row.tier}</p>
                  <p className="mt-2 text-sm leading-relaxed text-gray-700 md:mt-0">
                    {row.includes}
                  </p>
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
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent-orange)]">
              What Partners Gain
            </p>
            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {partnerGains.map((item, index) => (
                <motion.article
                  key={item.title}
                  className={`rounded-2xl p-[6px] ${index === 0 ? "border-2 border-gray-200" : "border border-gray-200"}`}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ duration: 0.4, ease: "easeOut", delay: index * 0.05 }}
                >
                  <div className="h-full rounded-xl bg-[#f9f9f9] p-6">
                    <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-gray-700">{item.body}</p>
                  </div>
                </motion.article>
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
              Current and Previous Partners
            </p>
            <p className="mt-4 max-w-4xl text-base leading-relaxed text-gray-700">
              TracTrac MSL works closely with ecosystem stakeholders that have
              participated in or contributed to TMF events.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {ecosystemPartners.map((item) => (
                <div key={item.name} className="rounded-xl border border-gray-200 bg-white p-4">
                  {item.href === "#" ? (
                    <p className="text-sm font-medium text-gray-800">{item.name}</p>
                  ) : (
                    <Link
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-medium text-gray-800 underline-offset-2 hover:underline"
                    >
                      {item.name}
                    </Link>
                  )}
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
            <div className="rounded-2xl border border-gray-200 bg-[#151515] px-6 py-10 text-white md:px-10">
              <p className="text-2xl font-semibold leading-tight md:text-3xl">
                Ready to close Nigeria&apos;s mechanization gap with us?
              </p>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/80 md:text-base">
                Contact the TMF secretariat to discuss strategic, investment,
                knowledge, and programme partnership options. Get the full TMF
                Partnership Prospectus with tier benefits, branding specifications,
                and investment expectations.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="mailto:partnerships@tmfnigeria.com"
                  className="rounded-lg px-5 py-3 text-sm font-semibold text-white"
                  style={{
                    background: "linear-gradient(182deg, #E12900 0%, #FA9411 100%)",
                  }}
                >
                  Become a Partner
                </a>
                <a
                  href="mailto:partnerships@tmfnigeria.com?subject=TMF%20Partnership%20Prospectus"
                  className="rounded-lg border border-white/45 bg-white/10 px-5 py-3 text-sm font-semibold text-white"
                >
                  Request Partnership Prospectus
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
