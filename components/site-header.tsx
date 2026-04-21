 "use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/events/tmf-26", label: "TMF 2026" },
    { href: "#faq", label: "FAQ" },
  ];

  const closeMenu = () => setMenuOpen(false);

  function smoothScrollToElement(element: HTMLElement, durationMs = 1400) {
    const startY = window.scrollY;
    const targetY = element.getBoundingClientRect().top + window.scrollY - 90;
    const distance = targetY - startY;
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
  }

  function handleFaqClick() {
    closeMenu();

    if (pathname === "/") {
      const faqSection = document.getElementById("faq");
      if (faqSection) {
        smoothScrollToElement(faqSection);
      }
      return;
    }

    sessionStorage.setItem("tmf_scroll_target", "faq");
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between px-6">
        <Link href="/" className="inline-flex items-center" onClick={closeMenu}>
          <Image
            src="/tmf/TMF-2.png"
            alt="TMF Nigeria logo"
            width={220}
            height={64}
            priority
            className="h-12 w-auto"
          />
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <nav className="flex items-center gap-6 text-sm font-medium text-gray-700">
            {navLinks.map((link) => (
              link.label === "FAQ" ? (
                <button
                  key={link.label}
                  type="button"
                  onClick={handleFaqClick}
                  className="text-sm font-medium text-gray-700"
                >
                  {link.label}
                </button>
              ) : (
                <Link key={link.href} href={link.href}>
                  {link.label}
                </Link>
              )
            ))}
          </nav>
          <Link
            href="/register"
            className="rounded-lg px-4 py-2 text-sm font-semibold text-white"
            style={{
              background: "linear-gradient(182deg, #E12900 0%, #FA9411 100%)",
            }}
          >
            Register
          </Link>
        </div>

        <motion.button
          type="button"
          className="inline-flex flex-col gap-1.5 md:hidden"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          whileTap={{ scale: 0.95 }}
        >
          <motion.span
            className="block h-0.5 w-6 bg-gray-900"
            animate={menuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.2 }}
          />
          <motion.span
            className="block h-0.5 w-6 bg-gray-900"
            animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
          <motion.span
            className="block h-0.5 w-6 bg-gray-900"
            animate={menuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.2 }}
          />
        </motion.button>
      </div>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="border-t border-gray-200 bg-white px-6 py-4 md:hidden"
          >
            <nav className="flex flex-col gap-3 text-sm font-medium text-gray-700">
              {navLinks.map((link) => (
                link.label === "FAQ" ? (
                  <button
                    key={link.label}
                    type="button"
                    onClick={handleFaqClick}
                    className="text-left"
                  >
                    {link.label}
                  </button>
                ) : (
                  <Link key={link.href} href={link.href} onClick={closeMenu}>
                    {link.label}
                  </Link>
                )
              ))}
              <Link
                href="/register"
                onClick={closeMenu}
                className="mt-2 inline-flex w-full items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold text-white"
                style={{
                  background: "linear-gradient(182deg, #E12900 0%, #FA9411 100%)",
                }}
              >
                Register for Event
              </Link>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
