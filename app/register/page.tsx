"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import SiteHeader from "../../components/site-header";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4100/api";

type FormState = {
  name: string;
  emailAddress: string;
  phoneNumber: string;
  organization: string;
  designation: string;
  location: string;
};

const initialState: FormState = {
  name: "",
  emailAddress: "",
  phoneNumber: "",
  organization: "",
  designation: "",
  location: "",
};

export default function RegisterPage() {
  const [form, setForm] = useState<FormState>(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/attendees/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventSlug: "tmf-26",
          attendee: {
            ...form,
            status: "Pending",
          },
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data?.error || "Unable to submit registration");
        return;
      }

      setSuccess("Registration received. We will contact you with next steps.");
      setForm(initialState);
    } catch {
      setError("Unable to connect to backend");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />

      <main className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/register.jpg"
            alt="TMF conference registration"
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <section className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-6xl items-center px-6 py-12">
          <div className="grid w-full gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="self-center text-white"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/80">
                THF 2026
              </p>
              <h1 className="mt-3 max-w-xl text-4xl font-semibold leading-tight md:text-5xl">
                Register for THF 2026
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-white/90 md:text-lg">
                Join policymakers, investors, agribusiness leaders, and service
                providers shaping Nigeria&apos;s mechanization future.
              </p>
              <div className="mt-8">
                <Link
                  href="/"
                  className="inline-flex rounded-lg border border-white/50 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm"
                >
                  Back to homepage
                </Link>
              </div>
            </motion.div>

            <motion.section
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: "easeOut", delay: 0.08 }}
              className="rounded-2xl border border-white/20 bg-white/95 p-6 shadow-2xl backdrop-blur md:p-8"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent-orange)]">
                Registration Form
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-gray-900">
                Reserve your seat
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Fill your details and submit. We will follow up with attendance
                confirmation.
              </p>

              <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                <label className="block text-sm font-medium text-gray-700">
                  Full name
                  <input
                    className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 outline-none focus:border-[var(--accent-orange)]"
                    value={form.name}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, name: event.target.value }))
                    }
                    required
                  />
                </label>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Email address
                    <input
                      type="email"
                      className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 outline-none focus:border-[var(--accent-orange)]"
                      value={form.emailAddress}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          emailAddress: event.target.value,
                        }))
                      }
                    />
                  </label>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone number
                    <input
                      className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 outline-none focus:border-[var(--accent-orange)]"
                      value={form.phoneNumber}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          phoneNumber: event.target.value,
                        }))
                      }
                    />
                  </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Organization
                    <input
                      className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 outline-none focus:border-[var(--accent-orange)]"
                      value={form.organization}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          organization: event.target.value,
                        }))
                      }
                    />
                  </label>
                  <label className="block text-sm font-medium text-gray-700">
                    Designation
                    <input
                      className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 outline-none focus:border-[var(--accent-orange)]"
                      value={form.designation}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          designation: event.target.value,
                        }))
                      }
                    />
                  </label>
                </div>

                <label className="block text-sm font-medium text-gray-700">
                  Location (Where are you coming from?)
                  <input
                    className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 outline-none focus:border-[var(--accent-orange)]"
                    value={form.location}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        location: event.target.value,
                      }))
                    }
                  />
                </label>

                {error ? <p className="text-sm text-red-600">{error}</p> : null}
                {success ? <p className="text-sm text-green-700">{success}</p> : null}

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full rounded-lg px-5 py-3 text-sm font-semibold text-white disabled:opacity-70"
                  style={{
                    background: "linear-gradient(182deg, #E12900 0%, #FA9411 100%)",
                  }}
                >
                  {loading ? "Submitting..." : "Submit registration"}
                </motion.button>
              </form>
            </motion.section>
          </div>
        </section>
      </main>
    </div>
  );
}
