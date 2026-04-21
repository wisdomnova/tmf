"use client";

import Image from "next/image";
import AboutIntroSection from "../components/about-intro-section";
import CrisisSection from "../components/crisis-section";
import EventsTimelineSection from "../components/events-timeline-section";
import FAQSection from "../components/faq-section";
import SiteFooter from "../components/site-footer";
import SiteHeader from "../components/site-header";
import TMF2025GallerySection from "../components/tmf-2025-gallery-section";
import { motion } from "framer-motion";
import { useEffect } from "react";

const eventImages = [
  "/event/event-01.jpg",
  "/event/event-02.jpg",
  "/event/event-03.jpg",
  "/event/event-04.jpg",
  "/event/event-05.jpg",
  "/event/event-06.jpg",
];

export default function Home() {
  useEffect(() => {
    const target = sessionStorage.getItem("tmf_scroll_target");
    if (target !== "faq") return;

    sessionStorage.removeItem("tmf_scroll_target");
    const faqSection = document.getElementById("faq");
    if (!faqSection) return;

    const startY = window.scrollY;
    const targetY = faqSection.getBoundingClientRect().top + window.scrollY - 90;
    const distance = targetY - startY;
    const durationMs = 1400;
    const startTime = performance.now();

    function easeInOutCubic(t: number) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function step(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      const eased = easeInOutCubic(progress);
      window.scrollTo(0, startY + distance * eased);
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <main>
        <motion.section
          className="relative h-screen overflow-hidden"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="absolute inset-0">
            <div className="hero-track flex h-full">
              {[...eventImages, ...eventImages].map((src, index) => (
                <div key={`${src}-${index}`} className="relative h-full min-w-[100vw]">
                  <Image
                    src={src}
                    alt="TMF event gallery"
                    fill
                    priority={index < 3}
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="absolute inset-0 bg-black/70" />

          <div className="relative z-10 mx-auto flex h-full w-full max-w-6xl items-center px-6">
            <motion.div
              className="max-w-2xl text-white"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.4 }}
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.12 } },
              }}
            >
              <motion.h1
                className="text-4xl font-semibold leading-tight md:text-6xl"
                variants={{
                  hidden: { opacity: 0, y: 18 },
                  show: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                Where Nigeria&apos;s mechanization future is decided
              </motion.h1>
              <motion.p
                className="mt-5 max-w-xl text-base text-white/90 md:text-lg"
                variants={{
                  hidden: { opacity: 0, y: 18 },
                  show: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                TMF is Nigeria&apos;s foremost convening platform for the agricultural
                mechanization ecosystem, uniting policy, investment, and innovation
                in one room.
              </motion.p>
              <motion.div
                className="mt-7 flex flex-wrap gap-3"
                variants={{
                  hidden: { opacity: 0, y: 18 },
                  show: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <a
                  href="/register"
                  className="rounded-lg px-5 py-3 text-sm font-semibold text-white"
                  style={{
                    background: "linear-gradient(182deg, #E12900 0%, #FA9411 100%)",
                  }}
                >
                  Register for TMF 2026
                </a>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        <motion.section
          className="mt-8 border-t border-gray-200 bg-white"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.div
            className="mx-auto grid w-full max-w-6xl gap-0 px-6 py-8 md:grid-cols-4"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.35 }}
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.1 } },
            }}
          >
            <motion.div
              className="border-b border-gray-200 py-4 md:border-b-0 md:border-r md:pr-6"
              variants={{
                hidden: { opacity: 0, y: 16 },
                show: { opacity: 1, y: 0 },
              }}
            >
              <p className="text-3xl font-semibold text-gray-900">135,000+</p>
              <p className="mt-2 text-sm font-medium text-gray-800">Farmers impacted</p>
              <p className="text-sm text-gray-600">Across Nigeria</p>
            </motion.div>

            <motion.div
              className="border-b border-gray-200 py-4 md:border-b-0 md:border-r md:px-6"
              variants={{
                hidden: { opacity: 0, y: 16 },
                show: { opacity: 1, y: 0 },
              }}
            >
              <p className="text-3xl font-semibold text-gray-900">3,900+</p>
              <p className="mt-2 text-sm font-medium text-gray-800">Young MSPs trained</p>
              <p className="text-sm text-gray-600">18-35 age group</p>
            </motion.div>

            <motion.div
              className="border-b border-gray-200 py-4 md:border-b-0 md:border-r md:px-6"
              variants={{
                hidden: { opacity: 0, y: 16 },
                show: { opacity: 1, y: 0 },
              }}
            >
              <p className="text-3xl font-semibold text-gray-900">500</p>
              <p className="mt-2 text-sm font-medium text-gray-800">
                Stakeholders at Policy Summit
              </p>
              <p className="text-sm text-gray-600">May 2026</p>
            </motion.div>

            <motion.div
              className="py-4 md:pl-6"
              variants={{
                hidden: { opacity: 0, y: 16 },
                show: { opacity: 1, y: 0 },
              }}
            >
              <p className="text-3xl font-semibold text-gray-900">50,000</p>
              <p className="mt-2 text-sm font-medium text-gray-800">
                Tractors needed by 2030
              </p>
              <p className="text-sm text-gray-600">National target</p>
            </motion.div>
          </motion.div>
        </motion.section>

        <AboutIntroSection />
        <CrisisSection />
        <EventsTimelineSection />
        <TMF2025GallerySection />
        <FAQSection />
        <SiteFooter />
      </main>
    </div>
  );
}
