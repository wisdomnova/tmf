"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const galleryImages = [
  "/tmf2025/slide-1.jpg",
  "/tmf2025/slide-2.jpg",
  "/tmf2025/slide-3.jpg",
  "/tmf2025/slide-4.jpg",
  "/tmf2025/slide-5.jpg",
  "/tmf2025/slide-6.jpg",
  "/tmf2025/slide-7.jpg",
  "/tmf2025/slide-8.jpg",
  "/tmf2025/slide-9.jpg",
  "/tmf2025/slide-10.jpg",
  "/tmf2025/slide-11.jpg",
  "/tmf2025/slide-12.jpg",
  "/tmf2025/slide-13.jpg",
  "/tmf2025/slide-14.jpg",
  "/tmf2025/slide-15.jpg",
  "/tmf2025/slide-16.jpg",
  "/tmf2025/slide-17.jpg",
  "/tmf2025/slide-18.jpg",
  "/tmf2025/slide-19.jpg",
  "/tmf2025/slide-20.jpg",
];

export default function TMF2025GallerySection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const sectionScale = useTransform(scrollYProgress, [0, 0.22, 0.78, 1], [0.9, 1, 1, 0.9]);
  const sectionOpacity = useTransform(scrollYProgress, [0, 0.18, 0.82, 1], [0.45, 1, 1, 0.45]);

  return (
    <motion.section
      ref={sectionRef}
      style={{ scale: sectionScale, opacity: sectionOpacity }}
      className="bg-[#0f0f0f] py-24 text-white"
    >
      <div className="mx-auto w-full max-w-7xl px-6">
        <motion.p
          className="text-xs font-semibold uppercase tracking-[0.16em] text-[#FA9411]"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          TMF 2025 Gallery
        </motion.p>
        <motion.h2
          className="mt-4 max-w-4xl text-3xl font-semibold leading-tight md:text-5xl"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.05 }}
        >
          A travel back in time through TMF 2025
        </motion.h2>
        <motion.p
          className="mt-5 max-w-3xl text-base leading-relaxed text-white/80 md:text-lg"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.45 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
        >
          Enter the energy, conversations, and decisive moments that shaped the
          forum. Every frame is paced slowly so the story can breathe.
        </motion.p>
      </div>

      <div className="mt-12 overflow-hidden">
        <div className="tmf-2025-track flex w-max gap-4 px-6 md:gap-6">
          {[...galleryImages, ...galleryImages].map((src, index) => (
            <article
              key={`${src}-${index}`}
              className="relative h-[300px] w-[78vw] overflow-hidden rounded-2xl border border-white/20 bg-black md:h-[420px] md:w-[44vw] lg:h-[480px] lg:w-[36vw]"
            >
              <Image
                src={src}
                alt="TMF 2025 moment"
                fill
                sizes="(max-width: 768px) 78vw, (max-width: 1200px) 44vw, 36vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent" />
            </article>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-12 w-full max-w-7xl px-6">
        <Link
          href="/register"
          className="inline-flex rounded-lg px-6 py-3 text-sm font-semibold text-white"
          style={{
            background: "linear-gradient(182deg, #E12900 0%, #FA9411 100%)",
          }}
        >
          Register for TMF 2026
        </Link>
      </div>
    </motion.section>
  );
}
