"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function StaffLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/staff/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data?.error || "Login failed");
        return;
      }

      localStorage.setItem("tmf_staff_token", data.token);

      const searchParams = new URLSearchParams(window.location.search);
      const nextPath = searchParams.get("next") || "/staff";
      router.push(nextPath);
    } catch {
      setError("Unable to connect to backend");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-6">
      <motion.section
        className="w-full rounded-2xl border border-gray-200 bg-gray-50 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-sm text-[var(--accent-orange)]">TMF Staff Access</p>
        <h1 className="mt-2 text-2xl font-semibold">Sign in to check-in desk</h1>
        <p className="mt-2 text-sm text-gray-700">
          Only authenticated staff can open attendee profile check-in pages.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm">
            Staff password
            <input
              type="password"
              className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          {error ? <p className="text-sm text-red-300">{error}</p> : null}

          <motion.button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[var(--accent-orange)] px-4 py-2 font-medium text-black disabled:opacity-60 cursor-pointer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? "Signing in..." : "Sign in"}
          </motion.button>
        </form>
      </motion.section>
    </main>
  );
}
