"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function AboutIntroSection() {
  return (
    <motion.section
      className="bg-white pt-24"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="mx-auto grid w-full max-w-7xl items-stretch gap-0 px-6 lg:grid-cols-12">
        <div className="flex items-center bg-[#f4f4f4] px-8 py-12 lg:col-span-6 lg:px-14">
          <motion.div
            className="max-w-xl"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.35 }}
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.1 } },
            }}
          >
            <motion.p
              className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-700"
              variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }}
            >
              What is TMF
            </motion.p>
            <motion.h2
              className="mt-4 text-4xl font-semibold leading-tight text-[#e12900] md:text-5xl"
              variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }}
            >
              Nigeria cannot mechanize in silos. That&apos;s why TMF exists.
            </motion.h2>
            <motion.p
              className="mt-6 text-base leading-relaxed text-gray-700 md:text-lg"
              variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }}
            >
              TMF is a high-level stakeholder convening by TracTrac MSL that brings
              government, investors, development partners, agribusinesses, and
              service providers into one room to solve Nigeria&apos;s mechanization gap.
            </motion.p>
            <motion.p
              className="mt-4 text-base leading-relaxed text-gray-700 md:text-lg"
              variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }}
            >
              With fewer than 6 tractors per 10,000 hectares, coordinated action is
              urgent. TMF exists to move from conversation to implementation.
            </motion.p>
          </motion.div>
        </div>

        <motion.div
          className="relative min-h-[420px] overflow-hidden lg:col-span-6 lg:min-h-[620px]"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <Image
            src="/page/side-talk.jpg"
            alt="TMF side discussion"
            fill
            className="object-cover"
          />
        </motion.div>
      </div>

      <div className="mx-auto w-full max-w-7xl px-6 pb-20">
        <motion.div
          className="mt-6 bg-[#f4f4f4] px-8 py-12 md:px-14"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <p className="text-base italic leading-relaxed text-gray-800 md:text-lg">
            &quot;Without supportive policy, innovations and investments risk not
            reaching their full potential. We must engage in robust discussions on
            how policy can create an enabling environment for sustainable
            mechanisation.&quot;
          </p>
          <p className="mt-4 text-base font-bold text-[#e12900] md:text-lg">
            - Godson Ohuruogu, CEO, TracTrac MSL
          </p>
        </motion.div>
      </div>
    </motion.section>
  );
}
