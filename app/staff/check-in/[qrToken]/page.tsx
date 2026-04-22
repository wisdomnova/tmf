"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import SignaturePad from "./signature-pad";
import StaffAuthModal from "./staff-auth-modal";
import CheckInSuccessModal from "./checkin-success-modal";
import AlreadyCheckedInModal from "./already-checkedin-modal";
import SignatureFullscreenModal from "./signature-fullscreen-modal";
import { motion } from "framer-motion";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4100/api";

type ProfileResponse = {
  attendee: {
    uuid: string;
    name: string;
    organization: string;
    designation: string;
    emailAddress: string;
    phoneNumber: string;
    location: string;
    status: string;
  };
  registration: {
    qrToken: string;
    checkedInAt: string | null;
  };
  event: {
    slug: string;
    title: string;
    location: string;
  };
};

export default function StaffCheckInPage() {
  const params = useParams<{ qrToken: string }>();
  const router = useRouter();
  const qrToken = params.qrToken;
  const [token, setToken] = useState("");
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [signatureData, setSignatureData] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [needsAuth, setNeedsAuth] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showAlreadyCheckedInModal, setShowAlreadyCheckedInModal] = useState(false);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!showSignatureModal) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [showSignatureModal]);

  useEffect(() => {
    const storedToken = localStorage.getItem("tmf_staff_token");
    if (!storedToken) {
      setNeedsAuth(true);
      setLoading(false);
      return;
    }
    setToken(storedToken);
    setNeedsAuth(false);
  }, [qrToken]);

  useEffect(() => {
    if (!token || !qrToken) return;
    let ignore = false;
    setLoading(true);
    setError("");

    fetch(`${API_BASE_URL}/check-in/${qrToken}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (response) => {
        const data = await response.json();
        if (response.status === 401) {
          localStorage.removeItem("tmf_staff_token");
          setToken("");
          setNeedsAuth(true);
          throw new Error("Staff authentication required");
        }
        if (!response.ok) {
          throw new Error(data?.error || "Unable to load attendee profile");
        }
        if (!ignore) setProfile(data);
      })
      .catch((fetchError: unknown) => {
        if (!ignore) {
          setError(
            fetchError instanceof Error
              ? fetchError.message
              : "Unable to load attendee profile",
          );
        }
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [token, qrToken]);

  async function handleModalLogin(password: string) {
    setAuthLoading(true);
    setAuthError("");

    try {
      const response = await fetch(`${API_BASE_URL}/staff/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await response.json();
      if (!response.ok) {
        setAuthError(data?.error || "Unable to verify staff password");
        return;
      }
      localStorage.setItem("tmf_staff_token", data.token);
      setToken(data.token);
      setNeedsAuth(false);
      setError("");
    } catch {
      setAuthError("Unable to connect to backend");
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleConfirmCheckIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (profile?.registration.checkedInAt) {
      setShowAlreadyCheckedInModal(true);
      return;
    }
    if (!signatureData) {
      setError("Signature is required before check-in confirmation.");
      return;
    }

    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/check-in/${qrToken}/confirm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          signatureData,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Check-in failed");
      }

      setMessage("Attendee marked present successfully.");
      setShowSuccessModal(true);
      setProfile((current) =>
        current
          ? {
              ...current,
              registration: {
                ...current.registration,
                checkedInAt: data.checkedInAt,
              },
            }
          : current,
      );
    } catch (submitError: unknown) {
      setError(
        submitError instanceof Error ? submitError.message : "Check-in failed",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-6 py-10">
        <p className="text-sm text-gray-600">Loading attendee profile...</p>
      </main>
    );
  }

  if (error && !profile) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-6 py-10">
        <p className="text-sm text-red-600">{error}</p>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-6 py-10">
        <p className="text-sm text-gray-600">No attendee profile found.</p>
      </main>
    );
  }

  const isCheckedIn = Boolean(profile.registration.checkedInAt);

  return (
    <main className="min-h-screen bg-[#f7f7f7] py-8">
      <StaffAuthModal
        open={needsAuth}
        loading={authLoading}
        error={authError}
        onSubmit={handleModalLogin}
      />
      <CheckInSuccessModal
        open={showSuccessModal}
        attendeeName={profile?.attendee.name || "Attendee"}
        eventTitle={profile?.event.title || "TMF event"}
        onClose={() => setShowSuccessModal(false)}
      />
      <AlreadyCheckedInModal
        open={showAlreadyCheckedInModal}
        attendeeName={profile?.attendee.name || "Attendee"}
        checkedInAt={profile?.registration.checkedInAt || new Date().toISOString()}
        onClose={() => setShowAlreadyCheckedInModal(false)}
      />
      <SignatureFullscreenModal
        open={showSignatureModal}
        onClose={() => setShowSignatureModal(false)}
        onChange={setSignatureData}
      />
      <motion.div
        className="mx-auto w-full max-w-6xl px-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-5">
          <button
            type="button"
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700"
            onClick={() => router.push("/staff")}
          >
            Back to list
          </button>
        </div>

        <section className="overflow-hidden rounded-2xl border border-[#1d1d1d]/10 bg-white shadow-sm">
          <div className="bg-[#151515] px-6 py-6 text-white md:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#FA9411]">
              Attendee Check-In
            </p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight md:text-4xl">
              {profile.attendee.name}
            </h1>
            <p className="mt-2 text-sm text-white/80 md:text-base">{profile.event.title}</p>
            <div className="mt-4">
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                  isCheckedIn
                    ? "bg-emerald-500/20 text-emerald-200 border border-emerald-300/35"
                    : "bg-white/10 text-white border border-white/25"
                }`}
              >
                {isCheckedIn
                  ? `Checked in ${new Date(profile.registration.checkedInAt!).toLocaleString()}`
                  : "Pending check-in"}
              </span>
            </div>
          </div>

          <div className="grid gap-8 p-6 md:grid-cols-12 md:gap-10 md:p-8 lg:p-10">
            <section className="md:col-span-5">
              <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-gray-500">
                Attendee Details
              </h2>
              <dl className="mt-4 space-y-4 text-sm">
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <dt className="text-xs uppercase tracking-wide text-gray-500">Organization</dt>
                  <dd className="mt-1 font-medium text-gray-900">
                    {profile.attendee.organization || "-"}
                  </dd>
                </div>
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <dt className="text-xs uppercase tracking-wide text-gray-500">Designation</dt>
                  <dd className="mt-1 font-medium text-gray-900">
                    {profile.attendee.designation || "-"}
                  </dd>
                </div>
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <dt className="text-xs uppercase tracking-wide text-gray-500">Phone</dt>
                  <dd className="mt-1 font-medium text-gray-900">
                    {profile.attendee.phoneNumber || "-"}
                  </dd>
                </div>
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <dt className="text-xs uppercase tracking-wide text-gray-500">Location</dt>
                  <dd className="mt-1 font-medium text-gray-900">
                    {profile.attendee.location || "-"}
                  </dd>
                </div>
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <dt className="text-xs uppercase tracking-wide text-gray-500">Attendee UUID</dt>
                  <dd className="mt-1 break-all font-medium text-gray-900">
                    {profile.attendee.uuid}
                  </dd>
                </div>
              </dl>
            </section>

            <section className="md:col-span-7">
              <form className="space-y-4" onSubmit={handleConfirmCheckIn}>
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-gray-500">
                    Digital Signature
                  </h2>
                  <p className="mt-2 text-sm text-gray-600">
                    Please ask attendee to sign below to confirm physical attendance.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSignatureModal(true)}
                  className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700"
                >
                  Open full-screen signature
                </button>
                <SignaturePad onChange={setSignatureData} />

                {error ? <p className="text-sm text-red-600">{error}</p> : null}
                {message ? <p className="text-sm text-emerald-700">{message}</p> : null}

                <motion.button
                  type="submit"
                  disabled={submitting || isCheckedIn}
                  className="w-full rounded-lg px-5 py-3 text-sm font-semibold text-white disabled:opacity-60 md:w-auto"
                  style={{
                    background: "linear-gradient(182deg, #E12900 0%, #FA9411 100%)",
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {submitting
                    ? "Checking in..."
                    : isCheckedIn
                      ? "Already checked in"
                      : "Mark as present"}
                </motion.button>
              </form>
            </section>
          </div>
        </section>
      </motion.div>
    </main>
  );
}
