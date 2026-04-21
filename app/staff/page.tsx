"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4100/api";

type StaffAttendeeItem = {
  attendee: {
    uuid: string;
    name: string;
    organization: string;
    designation: string;
    phoneNumber: string;
    location: string;
  };
  registration: {
    qrToken: string;
    checkedInAt: string | null;
  };
};

export default function StaffHomePage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [items, setItems] = useState<StaffAttendeeItem[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("tmf_staff_token");
    if (!token) {
      router.replace("/staff/login");
      return;
    }

    let ignore = false;
    setLoading(true);
    setError("");

    fetch(`${API_BASE_URL}/staff/attendees`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data?.error || "Unable to load attendees");
        }
        if (!ignore) {
          setItems(data);
        }
      })
      .catch((fetchError: unknown) => {
        if (!ignore) {
          setError(
            fetchError instanceof Error
              ? fetchError.message
              : "Unable to load attendees",
          );
        }
      })
      .finally(() => {
        if (!ignore) {
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [router]);

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => {
      const text = [
        item.attendee.name,
        item.attendee.organization,
        item.attendee.designation,
        item.attendee.phoneNumber,
        item.attendee.location,
        item.attendee.uuid,
      ]
        .join(" ")
        .toLowerCase();
      return text.includes(q);
    });
  }, [items, search]);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl items-center px-6">
      <motion.section
        className="w-full rounded-2xl border border-gray-200 bg-gray-50 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-sm text-[var(--accent-orange)]">Staff Console</p>
        <h1 className="mt-2 text-2xl font-semibold">Welcome to check-in desk</h1>
        <p className="mt-2 text-sm text-gray-700">
          Scan attendee QR cards to open secure profile pages and confirm
          event attendance.
        </p>
        <div className="mt-6">
          <label className="block text-sm">
            Search attendees
            <input
              className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2"
              placeholder="Search by name, phone, organization, location..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
        </div>

        <div className="mt-4 max-h-72 overflow-auto rounded-lg border border-gray-200 bg-white">
          {loading ? (
            <p className="p-4 text-sm text-gray-600">Loading attendees...</p>
          ) : null}
          {!loading && error ? (
            <p className="p-4 text-sm text-red-600">{error}</p>
          ) : null}
          {!loading && !error && filteredItems.length === 0 ? (
            <p className="p-4 text-sm text-gray-600">No attendees found.</p>
          ) : null}
          {!loading && !error && filteredItems.length > 0 ? (
            <ul>
              {filteredItems.map((item) => (
                <li key={item.registration.qrToken} className="border-t first:border-t-0">
                  <Link
                    href={`/staff/check-in/${item.registration.qrToken}`}
                    className="block px-4 py-3 hover:bg-gray-50"
                  >
                    <p className="font-medium">{item.attendee.name}</p>
                    <p className="text-xs text-gray-600">
                      {item.attendee.organization || "No organization"} ·{" "}
                      {item.attendee.phoneNumber || "No phone"} ·{" "}
                      {item.registration.checkedInAt ? "Checked in" : "Not checked in"}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <motion.div
          className="mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link
            href="/staff/login"
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm cursor-pointer"
          >
            <motion.span whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              Switch staff account
            </motion.span>
          </Link>
        </motion.div>
      </motion.section>
    </main>
  );
}
